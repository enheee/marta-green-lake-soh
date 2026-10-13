'use client';

import { useState } from 'react';

export type DeviceSettings = {
  rooms: { id: string; name: string }[];
  channels: { id: number; name: string; room: string }[];
  scenes: { id: string; name: string; commands: Record<string, number> }[];
  schedules: { id: string; name: string; scene: string; time: string; days: number[]; enabled: boolean }[];
};

export default function SettingsEditor({ settings, revision, save, close }: {
  settings: DeviceSettings; revision: string;
  save: (settings: DeviceSettings, revision: string) => Promise<void>; close: () => void;
}) {
  const [draft, setDraft] = useState<DeviceSettings>(() => structuredClone(settings));
  const [tab, setTab] = useState<'channels' | 'rooms' | 'scenes'>('channels');
  const [sceneId, setSceneId] = useState(settings.scenes[0]?.id || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900';
  const scene = draft.scenes.find(s => s.id === sceneId);
  const enabledSchedules = draft.schedules.filter(s => s.enabled && s.scene === sceneId);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try { await save(draft, revision); close(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Хадгалж чадсангүй.'); }
    finally { setBusy(false); }
  }

  return <section className="rounded-2xl border border-sky-200 bg-white p-5 sm:p-6" aria-label="Төхөөрөмжийн тохиргоо засах">
    <h3 className="text-lg font-bold text-slate-900">Нэр, өрөө, горим засах</h3>
    <p className="mt-2 text-sm text-slate-500">Хадгалах нь реле шууд ажиллуулахгүй. Горим ажиллуулахад эсвэл түүний идэвхтэй хуваарь ирэхэд сонгосон үйлдлүүд хэрэгжинэ.</p>
    <form onSubmit={submit} className="mt-4 space-y-5">
      <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
        <div className="flex flex-wrap gap-2">{(['channels', 'rooms', 'scenes'] as const).map((t, i) => <button type="button" key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-2 text-sm ${tab === t ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>{['Реле', 'Өрөө', 'Горим'][i]}</button>)}</div>
        {tab === 'channels' && <div className="grid gap-3 md:grid-cols-2">{draft.channels.map((c, i) => <div key={c.id} className="rounded-xl bg-slate-50 p-3">
          <label className="block text-xs font-semibold">CH {String(c.id).padStart(2, '0')} нэр<input className={`${field} mt-2`} required maxLength={64} value={c.name} onChange={e => setDraft(d => ({ ...d, channels: d.channels.map((r, n) => n === i ? { ...r, name: e.target.value } : r) }))} /></label>
          <label className="mt-2 block text-xs">Өрөө<select className={`${field} mt-1`} value={c.room} onChange={e => setDraft(d => ({ ...d, channels: d.channels.map((r, n) => n === i ? { ...r, room: e.target.value } : r) }))}>{draft.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
        </div>)}</div>}
        {tab === 'rooms' && <div className="space-y-3">{draft.rooms.map((r, i) => <label key={r.id} className="block text-xs font-semibold">Өрөө {i + 1}<input className={`${field} mt-1`} required maxLength={64} value={r.name} onChange={e => setDraft(d => ({ ...d, rooms: d.rooms.map((v, n) => n === i ? { ...v, name: e.target.value } : v) }))} /></label>)}<button type="button" disabled={draft.rooms.length >= 16} onClick={() => setDraft(d => ({ ...d, rooms: [...d.rooms, { id: crypto.randomUUID(), name: `Өрөө ${d.rooms.length + 1}` }] }))} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Өрөө нэмэх</button></div>}
        {tab === 'scenes' && <div className="space-y-4">
          <div className="flex gap-2"><select aria-label="Засах горим" value={sceneId} className={field} onChange={e => setSceneId(e.target.value)}>{draft.scenes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><button type="button" disabled={draft.scenes.length >= 32} onClick={() => { const id = crypto.randomUUID(); setDraft(d => ({ ...d, scenes: [...d.scenes, { id, name: 'Шинэ горим', commands: {} }] })); setSceneId(id); }} className="shrink-0 rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Горим нэмэх</button></div>
          {scene && <><label className="block text-xs font-semibold">Горимын нэр<input required maxLength={64} className={`${field} mt-1`} value={scene.name} onChange={e => setDraft(d => ({ ...d, scenes: d.scenes.map(s => s.id === sceneId ? { ...s, name: e.target.value } : s) }))} /></label>
            {!!enabledSchedules.length && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Энэ горим идэвхтэй хуваарьтай: {enabledSchedules.map(s => `${s.name} (${s.time})`).join(', ')}. Хадгалсан өөрчлөлт дараагийн хуваариар үйлчилнэ.</p>}
            <div className="grid gap-3 md:grid-cols-2">{draft.channels.map(c => <label key={c.id} className="text-xs">CH {c.id} · {c.name}<select className={`${field} mt-1`} value={scene.commands[String(c.id)] === undefined ? '' : String(scene.commands[String(c.id)])} onChange={e => { const value = e.target.value; setDraft(d => ({ ...d, scenes: d.scenes.map(s => { if (s.id !== sceneId) return s; const commands = { ...s.commands }; if (value === '') delete commands[String(c.id)]; else commands[String(c.id)] = Number(value); return { ...s, commands }; }) })); }}><option value="">Өөрчлөхгүй</option><option value="1">Асаах</option><option value="0">Унтраах</option></select></label>)}</div>
          </>}
        </div>}
      </fieldset>
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <div className="flex gap-3"><button disabled={busy} className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Хадгалж байна…' : 'Хадгалах'}</button><button type="button" disabled={busy} onClick={close} className="rounded-xl border px-5 py-3 text-sm">Болих</button></div>
    </form>
  </section>;
}
