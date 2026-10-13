import copy
from datetime import datetime
from pathlib import Path
import tempfile
import unittest
from automation import Store, defaults, validate


class AutomationTests(unittest.TestCase):
    def setUp(self):
        self.test_root = Path(__file__).resolve().parent / '.test-tmp'
        self.test_root.mkdir(exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=self.test_root)
        self.path = Path(self.temp.name) / 'settings.json'
        self.store = Store(self.path)
        self.calls = []
        self.now = datetime(2026, 10, 12, 22, 0)  # Monday

    def tearDown(self):
        assert Path(self.temp.name).resolve().parent == self.test_root
        self.temp.cleanup()

    def controller(self, command, relay, value):
        self.calls.append((relay, value))

    def enabled(self):
        settings = defaults()
        settings['scenes'][2]['commands'] = {'1': 0, '2': 1}
        settings['schedules'][0]['enabled'] = True
        self.store.save(settings)

    def test_default_schedule_never_sends_commands(self):
        self.store.tick(self.now, self.controller)
        self.assertEqual(self.calls, [])

    def test_once_per_date_survives_restart(self):
        self.enabled()
        self.store.tick(self.now, self.controller)
        self.store.tick(self.now, self.controller)
        Store(self.path).tick(self.now, self.controller)
        self.assertEqual(self.calls, [(1, 0), (2, 1)])
        self.store.tick(datetime(2026, 10, 13, 22, 0), self.controller)
        self.assertEqual(len(self.calls), 4)

    def test_weekday_and_missed_time_are_not_replayed(self):
        self.enabled()
        data = self.store.snapshot()['settings']
        data['schedules'][0]['days'] = [1]
        self.store.save(data)
        self.store.tick(self.now, self.controller)
        self.store.tick(datetime(2026, 10, 13, 22, 1), self.controller)
        self.assertEqual(self.calls, [])

    def test_partial_failure_stops_and_is_not_retried(self):
        self.enabled()
        def failing(command, relay, value):
            self.calls.append((relay, value))
            if relay == 2:
                raise OSError('offline')
        self.store.tick(self.now, failing)
        self.store.tick(self.now, failing)
        self.assertEqual(self.calls, [(1, 0), (2, 1)])
        self.assertTrue(any(not e['ok'] for e in self.store.snapshot()['events']))

    def test_bad_edit_does_not_replace_saved_settings(self):
        self.enabled()
        before = self.store.snapshot()['settings']
        wrong = copy.deepcopy(before)
        wrong['schedules'][0]['time'] = '25:00'
        with self.assertRaises(ValueError):
            self.store.save(wrong)
        self.assertEqual(Store(self.path).snapshot()['settings'], before)

    def test_empty_scene_cannot_be_enabled_or_executed(self):
        data = defaults()
        data['schedules'][0]['enabled'] = True
        with self.assertRaises(ValueError):
            validate(data)
        with self.assertRaises(ValueError):
            self.store.execute('sleep', self.controller)
        self.assertEqual(self.calls, [])

    def test_only_selected_relays_are_changed(self):
        self.enabled()
        self.store.execute('sleep', self.controller)
        self.assertEqual(self.calls, [(1, 0), (2, 1)])


if __name__ == '__main__':
    unittest.main()
