"""Token-authenticated loopback gateway for the portal's HTTPS tunnel."""
from datetime import datetime
import hashlib
import hmac
from http.server import BaseHTTPRequestHandler
import json
import re
from automation import validate


def revision(settings):
    return hashlib.sha256(json.dumps(settings, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def make_handler(controller, store, token):
    if not isinstance(token, str) or len(token) < 32:
        raise ValueError('Remote bridge token must contain at least 32 characters')

    class RemoteHandler(BaseHTTPRequestHandler):
        def reply(self, code, data):
            encoded = json.dumps(data, ensure_ascii=False).encode()
            self.send_response(code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(encoded)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(encoded)

        def authorized(self):
            supplied = self.headers.get('Authorization', '').encode()
            if hmac.compare_digest(supplied, ('Bearer '+token).encode()):
                return True
            self.reply(401, {'ok': False, 'error': 'Unauthorized'})
            return False

        def do_GET(self):
            if not self.authorized():
                return
            try:
                if self.path == '/status':
                    self.reply(200, {'ok': True, **controller('get_all_datas')})
                elif self.path == '/automation':
                    snapshot = store.snapshot()
                    self.reply(200, {'ok': True, 'settings': snapshot['settings'], 'revision': revision(snapshot['settings']), 'events': snapshot['events'], 'server_time': datetime.now().astimezone().isoformat(timespec='seconds')})
                else:
                    self.reply(404, {'ok': False, 'error': 'Not found'})
            except Exception:
                self.reply(502, {'ok': False, 'error': 'Самбарын төлөвийг уншиж чадсангүй.'})

        def do_POST(self):
            if not self.authorized():
                return
            if self.path == '/settings':
                self.save_settings()
                return
            if self.path not in ('/relay', '/scene'):
                self.reply(404, {'ok': False, 'error': 'Not found'})
                return
            try:
                size = int(self.headers.get('Content-Length', '0'))
                if not 0 < size <= 4096:
                    raise ValueError('Invalid request size')
                raw = self.rfile.read(size)
                data = json.loads(raw)
                ident = self.headers.get('X-A32-Command-ID', '')
                if not re.fullmatch(r'[a-fA-F0-9-]{36}', ident) or not isinstance(data, dict) or data.get('requestId') != ident:
                    raise ValueError('Command ID is required')
                if self.path == '/relay':
                    if type(data.get('relay')) is not int or data['relay'] not in range(1, 33) or data.get('state') not in ('ON', 'OFF'):
                        raise ValueError('Invalid relay command')
                elif not isinstance(data.get('id'), str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,64}', data['id']):
                    raise ValueError('Invalid scene ID')
            except (ValueError, TypeError, json.JSONDecodeError):
                self.reply(400, {'ok': False, 'error': 'Invalid command'})
                return

            fingerprint = hashlib.sha256(self.path.encode()+json.dumps(data, sort_keys=True).encode()).hexdigest()
            with store.command_lock:
                with store.lock:
                    ledger = store.data.setdefault('remote_requests', {})
                    previous = ledger.get(ident)
                    if previous:
                        if previous['fingerprint'] != fingerprint:
                            self.reply(409, {'ok': False, 'error': 'Command ID already used'})
                        elif previous.get('result'):
                            self.reply(previous['code'], previous['result'])
                        else:
                            self.reply(409, {'ok': False, 'error': 'Өмнөх командын үр дүн тодорхойгүй. Төлөвөө шинэчилж шалгана уу.'})
                        return
                    ledger[ident] = {'fingerprint': fingerprint}
                    # Reserve durably before operating a relay. If the PC stops,
                    # replaying the same request cannot execute the scene twice.
                    try:
                        store.persist()
                    except OSError:
                        ledger.pop(ident, None)
                        self.reply(503, {'ok': False, 'error': 'Command journal unavailable'})
                        return
                try:
                    if self.path == '/relay':
                        result = controller('set_output', data['relay'], 1 if data['state'] == 'ON' else 0)
                        store.log(f'Портал: CH {data["relay"]:02} — {data["state"]}')
                        response = {'ok': True, 'response': result, 'requestId': ident}
                    else:
                        applied = store.execute(data['id'], controller, 'Портал')
                        response = {'ok': True, 'applied': applied, 'requestId': ident}
                    code = 200
                except ValueError as error:
                    code, response = 400, {'ok': False, 'error': str(error), 'requestId': ident}
                except Exception:
                    code, response = 502, {'ok': False, 'error': 'Самбарын команд баталгаажаагүй. Төлөвөө шинэчилж шалгана уу.', 'requestId': ident}
                with store.lock:
                    ledger[ident].update(code=code, result=response)
                    store.data['remote_requests'] = dict(list(ledger.items())[-512:])
                    try:
                        store.persist()
                    except OSError:
                        code, response = 503, {'ok': False, 'error': 'Команд илгээгдсэн байж болно. Түүх хадгалах алдаа гарлаа; төлөвөө шалгана уу.'}
                self.reply(code, response)

        def save_settings(self):
            try:
                size = int(self.headers.get('Content-Length', '0'))
                if not 0 < size <= 32768:
                    raise ValueError('Invalid request size')
                data = json.loads(self.rfile.read(size))
                if not isinstance(data, dict) or not isinstance(data.get('settings'), dict):
                    raise ValueError('Invalid settings')
                with store.command_lock, store.lock:
                    current = store.data['settings']
                    if data.get('revision') != revision(current):
                        self.reply(409, {'ok': False, 'error': 'Тохиргоо өөр газар шинэчлэгдсэн байна. Засварыг хааж, шинэ төлөвөөс дахин засна уу.'})
                        return
                    # Portal editing never changes or enables schedules.
                    clean = validate({**data['settings'], 'schedules': current['schedules']})
                    previous = store.data['settings']
                    store.data['settings'] = clean
                    try:
                        store.persist()
                    except OSError:
                        store.data['settings'] = previous
                        raise
                    self.reply(200, {'ok': True, 'settings': clean, 'revision': revision(clean)})
            except (ValueError, TypeError, AttributeError):
                self.reply(400, {'ok': False, 'error': 'Өрөө, реле эсвэл горимын тохиргоо буруу байна.'})
            except OSError:
                self.reply(503, {'ok': False, 'error': 'Тохиргоог хадгалж чадсангүй.'})

        def log_message(self, *_args):
            pass

    return RemoteHandler
