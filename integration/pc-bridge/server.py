"""Local companion server for the KinCony A32 Pro browser dashboard."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import ipaddress
import json
import urllib.error
import urllib.parse
import urllib.request
import os
import sys
import threading
import webbrowser
from datetime import datetime
from automation import Store
from remote import make_handler

ROOT = Path(__file__).resolve().parent
PORT = int(os.environ.get('A32_PORT', '8765'))
CONFIG = json.loads((ROOT.parent / 'a32-controller-config.json').read_text(encoding='utf-8-sig'))
STORE = Store(ROOT.parent / 'a32-automation.json')


def controller_config():
    config = json.loads((ROOT.parent / 'a32-controller-config.json').read_text(encoding='utf-8-sig'))
    address = ipaddress.ip_address(config['host'])
    if address.version != 4 or not address.is_private:
        raise ValueError('Invalid controller address')
    return config


class Handler(SimpleHTTPRequestHandler):
    @staticmethod
    def controller(command, relay=0, value=0):
        config = controller_config()
        query = urllib.parse.urlencode({'secret': config['secret'], 'cmd': command, 'id': relay, 'value': value})
        try:
            with urllib.request.urlopen(f"http://{config['host']}/ctrl.cgi?{query}", timeout=5) as response:
                result = json.loads(response.read(8192))
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            raise OSError('Самбарт холбогдож чадсангүй') from error
        if result.get('status') != 'success' or result.get('code') != 0:
            raise ValueError(result.get('status', 'Controller rejected command'))
        return result

    def do_GET(self):
        if self.path == '/api/status':
            try:
                self._json(200, {'ok': True, 'host': controller_config()['host'], **self.controller('get_all_datas')})
            except (ValueError, urllib.error.URLError, TimeoutError, OSError) as error:
                self._json(502, {'ok': False, 'error': str(error)})
        elif self.path == '/api/automation':
            self._json(200, {'ok': True, **STORE.snapshot(), 'server_time': datetime.now().astimezone().isoformat(timespec='seconds'), 'scheduler': 'PC server'})
        elif self.path.startswith('/api/'):
            self._json(404, {'ok': False, 'error': 'Unknown API endpoint'})
        elif self.path.split('?')[0] not in ('/', '/index.html', '/dashboard.js'):
            self.send_error(404)
        else:
            super().do_GET()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path not in ('/api/relay', '/api/automation', '/api/scene'):
            self._json(404, {'ok': False, 'error': 'Unknown API endpoint'})
            return
        origin = self.headers.get('Origin')
        if origin and origin not in (f'http://127.0.0.1:{self.server.server_port}', f'http://localhost:{self.server.server_port}'):
            self._json(403, {'ok': False, 'error': 'Origin not allowed'})
            return
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if not 0 < size <= 65536:
                raise ValueError("Request too large")
            data = json.loads(self.rfile.read(size))
            if not isinstance(data, dict):
                raise ValueError('JSON object required')
            if self.path == '/api/automation':
                self._json(200, {'ok': True, **STORE.save(data)})
                return
            if self.path == '/api/scene':
                applied = STORE.execute(data.get('id'), self.controller)
                self._json(200, {'ok': True, 'applied': applied})
                return
            relay = int(data.get("relay", 0))
            state = str(data.get("state", "")).upper()
            if relay not in range(1, 33) or state not in {"ON", "OFF"}:
                raise ValueError("Invalid controller address or relay command")
            with STORE.command_lock:
                result = self.controller('set_output', relay, 1 if state == 'ON' else 0)
                STORE.log(f'CH {relay:02} — {"асаасан" if state == "ON" else "унтраасан"}')
            self._json(200, {'ok': True, 'response': result})
        except (ValueError, TypeError, json.JSONDecodeError) as error:
            self._json(400, {"ok": False, "error": str(error)})
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            self._json(502, {"ok": False, "error": f"Controller did not respond: {error}"})

    def _json(self, status, payload):
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(encoded)

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    print(f"A32 Control is ready at http://127.0.0.1:{PORT}")
    print("Keep this window open while using the dashboard.")
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    remote_server = None
    remote_config = controller_config().get('remote_bridge', {})
    if remote_config.get('enabled') is True:
        remote_server = ThreadingHTTPServer(('127.0.0.1', 8767), make_handler(Handler.controller, STORE, remote_config.get('token')))
        threading.Thread(target=remote_server.serve_forever, daemon=True).start()
        print('Authenticated portal bridge ready at http://127.0.0.1:8767', flush=True)
    stop = threading.Event()
    threading.Thread(target=STORE.run, args=(stop, Handler.controller), daemon=True).start()
    if '--open-browser' in sys.argv:
        threading.Timer(1, lambda: webbrowser.open(f'http://127.0.0.1:{PORT}/')).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        stop.set()
        if remote_server:
            remote_server.shutdown()
            remote_server.server_close()
        server.server_close()
