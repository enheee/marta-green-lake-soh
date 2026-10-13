import json
from pathlib import Path
import tempfile
import threading
import unittest
import urllib.request
import urllib.error
from http.server import ThreadingHTTPServer
from automation import Store
from remote import make_handler


class RemoteTests(unittest.TestCase):
    def setUp(self):
        root = Path(__file__).parent / '.test-tmp'
        root.mkdir(exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=root)
        self.path = Path(self.temp.name) / 'settings.json'
        self.store = Store(self.path)
        self.calls = []
        def fake(command, relay=0, value=0):
            if command == 'set_output':
                self.calls.append((relay, value))
            return {'outputs': [0]*32, 'inputs': [0]*40}
        self.http = ThreadingHTTPServer(('127.0.0.1', 0), make_handler(fake, self.store, 't'*40))
        self.thread = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.thread.join()
        self.temp.cleanup()

    def request(self, path, data=None, token='t'*40):
        headers = {'Authorization': 'Bearer '+token, 'Content-Type': 'application/json'}
        if data and 'requestId' in data:
            headers['X-A32-Command-ID'] = data['requestId']
        req = urllib.request.Request(f'http://127.0.0.1:{self.http.server_port}'+path, data=json.dumps(data).encode() if data else None, headers=headers)
        try:
            response = urllib.request.urlopen(req, timeout=3)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            return response.status, json.load(response)

    def test_auth_and_private_data(self):
        self.assertEqual(self.request('/status', token='wrong')[0], 401)
        self.assertEqual(self.request('/status')[0], 200)
        data = self.request('/automation')[1]
        self.assertNotIn('remote_requests', data)
        self.assertNotIn('token', data)
        self.assertEqual(self.calls, [])

    def test_replay_and_persistence(self):
        data = {'relay': 2, 'state': 'ON', 'requestId': '11111111-1111-1111-1111-111111111111'}
        self.assertEqual(self.request('/relay', data)[0], 200)
        self.assertEqual(self.request('/relay', data)[0], 200)
        self.assertEqual(self.calls, [(2, 1)])
        self.assertIn(data['requestId'], Store(self.path).data['remote_requests'])
        data['state'] = 'OFF'
        self.assertEqual(self.request('/relay', data)[0], 409)
        self.assertEqual(self.calls, [(2, 1)])

    def test_invalid_command(self):
        data = {'relay': 33, 'state': 'ON', 'requestId': '22222222-2222-2222-2222-222222222222'}
        self.assertEqual(self.request('/relay', data)[0], 400)
        self.assertEqual(self.calls, [])

    def test_edit_settings_persists_without_controller_commands(self):
        snapshot = self.request('/automation')[1]
        settings = snapshot['settings']
        settings['channels'][0]['name'] = 'Зочны өрөө'
        settings['rooms'][0]['name'] = 'Нэгдүгээр давхар'
        settings['scenes'][1]['commands'] = {'1': 1}
        settings['schedules'][0]['enabled'] = True
        body = {'settings': settings, 'revision': snapshot['revision']}
        code, result = self.request('/settings', body)
        self.assertEqual(code, 200)
        saved = Store(self.path).data['settings']
        self.assertEqual(saved['channels'][0]['name'], 'Зочны өрөө')
        self.assertEqual(saved['scenes'][1]['commands'], {'1': 1})
        self.assertFalse(saved['schedules'][0]['enabled'])
        self.assertNotEqual(result['revision'], snapshot['revision'])
        self.assertEqual(self.request('/settings', body)[0], 409)
        self.assertEqual(self.calls, [])

    def test_invalid_settings_and_unauthenticated_edit(self):
        snapshot = self.request('/automation')[1]
        body = {'settings': snapshot['settings'], 'revision': snapshot['revision']}
        self.assertEqual(self.request('/settings', body, token='wrong')[0], 401)
        body['settings']['channels'][0]['room'] = 'unknown'
        self.assertEqual(self.request('/settings', body)[0], 400)
        self.assertEqual(self.request('/automation')[1]['revision'], snapshot['revision'])
        self.assertEqual(self.calls, [])


if __name__ == '__main__':
    unittest.main()
