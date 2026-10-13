"""Persistent room/scene settings and a local, once-per-day scheduler."""
import copy
from datetime import datetime
import json
from pathlib import Path
import re
import threading


def defaults():
    return {
        'rooms': [{'id': f'room{i}', 'name': f'Өрөө {i}'} for i in range(1, 5)],
        'channels': [{'id': i, 'name': f'Реле {i:02}', 'room': f'room{(i-1)//8+1}'} for i in range(1, 33)],
        'scenes': [
            {'id': 'away', 'name': 'Гэрээс гарах', 'commands': {str(i): 0 for i in range(1, 33)}},
            {'id': 'home', 'name': 'Гэрт ирэх', 'commands': {}},
            {'id': 'sleep', 'name': 'Унтах', 'commands': {}},
        ],
        'schedules': [{'id': 'night', 'name': 'Оройн жишээ', 'scene': 'sleep', 'time': '22:00', 'days': list(range(7)), 'enabled': False}],
    }


def validate(data):
    result = copy.deepcopy(data)
    for key, limit in [('rooms', 16), ('channels', 32), ('scenes', 32), ('schedules', 64)]:
        rows = result.get(key)
        if not isinstance(rows, list) or len(rows) > limit:
            raise ValueError(f'Invalid {key}')
        ids = []
        for row in rows:
            if not isinstance(row, dict):
                raise ValueError('Invalid entry')
            ident = row.get('id')
            if key == 'channels':
                if type(ident) is not int or ident not in range(1, 33):
                    raise ValueError('Invalid channel')
            elif not isinstance(ident, str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,64}', ident):
                raise ValueError('Invalid ID')
            ids.append(ident)
            name = row.get('name')
            if not isinstance(name, str) or not 1 <= len(name.strip()) <= 64:
                raise ValueError('Name must contain 1–64 characters')
            row['name'] = name.strip()
        if len(set(ids)) != len(ids):
            raise ValueError('Duplicate IDs')
    rooms = {r['id'] for r in result['rooms']}
    if not rooms or {r['id'] for r in result['channels']} != set(range(1, 33)):
        raise ValueError('32 channels and at least one room are required')
    for row in result['channels']:
        if row.get('room') not in rooms:
            raise ValueError('Unknown room')
    scenes = {r['id']: r for r in result['scenes']}
    for row in scenes.values():
        commands = row.get('commands')
        if not isinstance(commands, dict) or len(commands) > 32:
            raise ValueError('Invalid scene commands')
        for channel, value in commands.items():
            if channel not in {str(i) for i in range(1, 33)} or type(value) is not int or value not in (0, 1):
                raise ValueError('Invalid relay command')
    for row in result['schedules']:
        if row.get('scene') not in scenes:
            raise ValueError('Unknown scene')
        if not isinstance(row.get('time'), str) or not re.fullmatch(r'(?:[01]\d|2[0-3]):[0-5]\d', row['time']):
            raise ValueError('Invalid schedule time')
        days = row.get('days')
        if not isinstance(days, list) or not days or any(type(d) is not int or d not in range(7) for d in days) or len(set(days)) != len(days):
            raise ValueError('Select at least one unique weekday')
        if type(row.get('enabled')) is not bool:
            raise ValueError('Invalid enabled flag')
        if row['enabled'] and not scenes[row['scene']]['commands']:
            raise ValueError('Горимд эхлээд реле сонгоно уу')
        row.pop('last_run', None)
    return {key: result[key] for key in ('rooms', 'channels', 'scenes', 'schedules')}


class Store:
    def __init__(self, path):
        self.path = Path(path)
        self.lock = threading.RLock()
        self.command_lock = threading.RLock()
        self.data = json.loads(self.path.read_text(encoding='utf-8')) if self.path.exists() else {'settings': defaults(), 'runs': {}, 'events': []}
        validate(self.data['settings'])

    def persist(self):
        temp = self.path.with_suffix('.tmp')
        temp.write_text(json.dumps(self.data, ensure_ascii=False, indent=2), encoding='utf-8')
        temp.replace(self.path)

    def snapshot(self):
        with self.lock:
            return copy.deepcopy(self.data)

    def save(self, data):
        clean = validate(data)
        with self.lock:
            self.data['settings'] = clean
            self.persist()
        return self.snapshot()

    def log(self, text, ok=True):
        with self.lock:
            self.data['events'].insert(0, {'time': datetime.now().astimezone().isoformat(timespec='seconds'), 'text': text, 'ok': ok})
            self.data['events'] = self.data['events'][:100]
            self.persist()

    def execute(self, scene_id, controller, source='Горим'):
        with self.command_lock:
            with self.lock:
                scene = next((copy.deepcopy(s) for s in self.data['settings']['scenes'] if s['id'] == scene_id), None)
            if scene is None or not scene['commands']:
                raise ValueError('Горимд эхлээд реле сонгоно уу')
            applied = []
            try:
                for channel, value in sorted(scene['commands'].items(), key=lambda x: int(x[0])):
                    controller('set_output', int(channel), value)
                    applied.append(int(channel))
            except Exception as error:
                self.log(f'{source}: {scene["name"]} — {len(applied)} реле өөрчлөгдсөн, алдаа: {error}', False)
                raise ValueError(f'{len(applied)} реле өөрчлөгдсөн. Үлдсэн команд зогссон: {error}') from error
            self.log(f'{source}: {scene["name"]} — {len(applied)} реле')
            return applied

    def tick(self, now, controller):
        # Do not replay missed times after a restart; reserve before sending so
        # a failed/partial scene is not repeatedly sent in the same minute.
        with self.lock:
            due = []
            for schedule in self.data['settings']['schedules']:
                key = f'{schedule["id"]}:{now.date().isoformat()}'
                if schedule['enabled'] and now.weekday() in schedule['days'] and schedule['time'] == now.strftime('%H:%M') and key not in self.data['runs']:
                    self.data['runs'][key] = 'started'
                    due.append((key, schedule['scene']))
            if due:
                self.data['runs'] = dict(list(self.data['runs'].items())[-512:])
                self.persist()
        for key, scene_id in due:
            try:
                self.execute(scene_id, controller, 'Хуваарь')
                result = 'success'
            except Exception as error:
                result = str(error)
                self.log(f'Хуваарийн алдаа: {error}', False)
            with self.lock:
                self.data['runs'][key] = result
                self.persist()

    def run(self, stop, controller):
        while not stop.is_set():
            try:
                self.tick(datetime.now().astimezone(), controller)
            except Exception as error:
                print(f'Scheduler: {error}', flush=True)
            stop.wait(2)
