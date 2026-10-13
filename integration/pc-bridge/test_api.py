import json
from pathlib import Path
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
import server
from automation import Store, defaults


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.root = Path(__file__).resolve().parent / '.test-tmp'
        self.root.mkdir(exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=self.root)
        self.old_store = server.STORE
        self.old_controller = server.Handler.controller
        server.STORE = Store(Path(self.temp.name) / 'settings.json')
        self.outputs = [0] * 32
        self.calls = []
        def fake(command, relay=0, value=0):
            if command == 'set_output':
                self.calls.append((relay, value))
                self.outputs[relay-1] = value
                return {'status': 'success', 'code': 0, 'id': relay, 'value': value}
            return {'status': 'success', 'code': 0, 'outputs': self.outputs, 'inputs': [0]*40}
        server.Handler.controller = staticmethod(fake)
        self.http = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        self.thread = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()
        self.base = f'http://127.0.0.1:{self.http.server_port}'

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.thread.join(timeout=2)
        server.STORE = self.old_store
        server.Handler.controller = staticmethod(self.old_controller)
        assert Path(self.temp.name).resolve().parent == self.root
        self.temp.cleanup()

    def request(self, path, payload=None, origin=None):
        headers = {'Content-Type': 'application/json'}
        if origin:
            headers['Origin'] = origin
        data = json.dumps(payload).encode() if payload is not None else None
        request = urllib.request.Request(self.base+path, data=data, headers=headers)
        with urllib.request.urlopen(request, timeout=3) as response:
            return json.load(response)

    def test_save_reload_and_scene_execution(self):
        settings = defaults()
        settings['channels'][0]['name'] = 'Гэрэл <1>'
        settings['scenes'][1]['commands'] = {'2': 1}
        self.assertTrue(self.request('/api/automation', settings)['ok'])
        self.assertEqual(self.request('/api/automation')['settings']['channels'][0]['name'], 'Гэрэл <1>')
        result = self.request('/api/scene', {'id': 'home'})
        self.assertEqual(result['applied'], [2])
        self.assertEqual(self.request('/api/status')['outputs'][1], 1)
        self.assertEqual(self.calls, [(2, 1)])
        self.assertNotIn('secret', self.request('/api/automation'))

    def test_invalid_edits_empty_scenes_and_foreign_origin(self):
        for path, payload, origin, expected in [
            ('/api/scene', {'id': 'sleep'}, None, 400),
            ('/api/automation', {}, None, 400),
            ('/api/relay', {'relay': 1, 'state': 'ON'}, 'http://evil.example', 403),
        ]:
            with self.assertRaises(urllib.error.HTTPError) as error:
                self.request(path, payload, origin)
            self.assertEqual(error.exception.code, expected)
            self.assertFalse(json.load(error.exception)['ok'])
        self.assertEqual(self.calls, [])

    def test_frontend_asset_and_private_files(self):
        with urllib.request.urlopen(self.base+'/dashboard.js?v=3') as response:
            self.assertIn(b'editSchedule', response.read())
        with urllib.request.urlopen(self.base+'/') as response:
            html = response.read().decode()
            self.assertIn('editorback', html)
            self.assertIn('scheduleList', html)
        with self.assertRaises(urllib.error.HTTPError) as error:
            urllib.request.urlopen(self.base+'/server.py')
        self.assertEqual(error.exception.code, 404)


if __name__ == '__main__':
    unittest.main()
