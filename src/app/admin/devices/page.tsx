'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, Clock, Gauge, Lock, LogOut, Power, RefreshCw, Wifi } from 'lucide-react';
import SettingsEditor, { DeviceSettings } from './settings-editor';

type Session = { configured: boolean; authenticated: boolean; bridgeConfigured: boolean };
type DeviceStatus = { outputs: number[]; inputs: number[] };
type Automation = {
  revision: string;
  settings: {
    rooms: { id: string; name: string }[];
    channels: { id: number; name: string; room: string }[];
    scenes: { id: string; name: string; commands: Record<string, number> }[];
    schedules: { id: string; name: string; scene: string; time: string; days: number[]; enabled: boolean }[];
  };
  events: { time: string; text: string; ok: boolean }[];
  server_time: string;
};
class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
async function api(path: string, body?: object, method?: string) {
  const response = await fetch(`/api/a32/${path}`, { cache: 'no-store', method: method || (body ? 'POST' : 'GET'), ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
  if (!response.headers.get('content-type')?.includes('application/json')) throw new ApiError('Серверийн хариуг уншиж чадсангүй.', response.status);
  const data = await response.json();
  if (!response.ok || data.ok === false) throw new ApiError(data.error || 'Холболтын алдаа.', response.status);
  return data;
}

export default function DevicesPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [automation, setAutomation] = useState<Automation | null>(null);
  const [room, setRoom] = useState('all');
  const [working, setWorking] = useState(false);
  const [updated, setUpdated] = useState('');
  const [edit, setEdit] = useState<{ settings: DeviceSettings; revision: string } | null>(null);
  const pending = useRef(false);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const failure = useCallback((error: unknown) => {
    if (!alive.current) return;
    setError(error instanceof Error ? error.message : 'Холболтын алдаа.');
    setStatus(null);
    if (error instanceof ApiError && error.status === 401) setSession(s => s ? { ...s, authenticated: false } : s);
  }, []);

  useEffect(() => {
    api('session').then(s => { if (alive.current) setSession(s); }).catch(failure);
  }, [failure]);

  const refresh = useCallback(async () => {
    try {
      const [s, a] = await Promise.all([api('status'), api('automation')]);
      if (!alive.current) return;
      if (!Array.isArray(s.outputs) || s.outputs.length !== 32 || !Array.isArray(s.inputs) || !a.settings || !Array.isArray(a.settings.channels)) throw new Error('Самбарын төлөвийн хариу буруу байна.');
      setStatus(s); setAutomation(a); setUpdated(new Date().toLocaleTimeString('mn-MN')); setError('');
    } catch (error) { failure(error); }
  }, [failure]);

  useEffect(() => {
    if (!session?.authenticated) return;
    refresh();
    const timer = setInterval(() => { if (!pending.current) refresh(); }, 5000);
    return () => clearInterval(timer);
  }, [session?.authenticated, refresh]);

  async function login(event: React.FormEvent) {
    event.preventDefault(); setWorking(true); setError('');
    try { await api('session', { password }); setPassword(''); setSession(s => ({ configured: true, bridgeConfigured: s?.bridgeConfigured || false, authenticated: true })); }
    catch (error) { failure(error); }
    finally { setWorking(false); }
  }

  async function logout() {
    try { await api('session', undefined, 'DELETE'); setStatus(null); setAutomation(null); setEdit(null); setSession(s => s ? { ...s, authenticated: false } : s); setNotice(''); }
    catch (error) { failure(error); }
  }

  async function saveSettings(settings: DeviceSettings, revision: string) {
    if (pending.current) throw new Error('Өмнөх үйлдлийг дуусахыг хүлээнэ үү.');
    pending.current = true; setWorking(true);
    try {
      await api('settings', { settings, revision });
      setNotice('Нэр, өрөө, горимыг хадгаллаа.');
      setRoom('all');
      await refresh();
    } finally { pending.current = false; setWorking(false); }
  }

  async function command(path: string, body: object) {
    if (pending.current || !status) return;
    pending.current = true; setWorking(true); setNotice(''); setError('');
    let commandError = '';
    try { await api(path, { ...body, requestId: crypto.randomUUID() }); setNotice('Самбар команд хүлээн авлаа.'); }
    catch (error) { commandError = error instanceof Error ? error.message : 'Командын үр дүн тодорхойгүй.'; failure(error); }
    finally { await refresh(); if (commandError) setError(commandError); pending.current = false; setWorking(false); }
  }

  if (!session) return <div className="rounded-2xl border bg-white p-8 text-slate-600">{error || 'Төхөөрөмжийн нэвтрэлтийг шалгаж байна…'}</div>;
  if (!session.authenticated) return (
    <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <Lock className="mb-4 h-8 w-8 text-sky-600" />
      <h2 className="text-2xl font-bold text-slate-900">Төхөөрөмжийн удирдлагад нэвтрэх</h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">A32 реле удирдах эрхийг сервер дээр шалгана. Энэ нууц үг нь порталын ердийн PIN-ээс тусдаа.</p>
      {!session.configured ? <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Төхөөрөмжийн нэвтрэх тохиргоо хийгдээгүй байна. Сервер дээр A32_ADMIN_PASSWORD болон A32_SESSION_SECRET тохируулсны дараа ашиглана.</p> : (
        <form className="mt-6 space-y-4" onSubmit={login}>
          <label className="block text-sm font-semibold text-slate-700">Төхөөрөмжийн нууц үг<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3 text-slate-900" /></label>
          <button disabled={working} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white disabled:opacity-50">{working ? 'Шалгаж байна…' : 'Нэвтрэх'}</button>
        </form>
      )}
      {error && <p role="alert" className="mt-4 text-sm text-rose-600">{error}</p>}
    </div>
  );

  const settings = automation?.settings;
  const channels = settings?.channels.filter(c => room === 'all' || c.room === room) || [];
  const dayNames = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'];
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-wider text-sky-600">KinCony A32 Pro</p><h2 className="mt-1 text-2xl font-black text-slate-900">Төхөөрөмжийн удирдлага</h2><p className="mt-2 text-sm text-slate-500">{updated ? `Сүүлд шинэчилсэн: ${updated}` : 'Самбарт холбогдож байна…'} · 5 секунд тутам шинэчлэгдэнэ</p></div>
        <div className="flex gap-2"><button onClick={() => refresh()} disabled={working} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"><RefreshCw className="h-4 w-4" />Шинэчлэх</button><button onClick={logout} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold"><LogOut className="h-4 w-4" />Төхөөрөмжөөс гарах</button></div>
      </header>
      {!session.bridgeConfigured && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">PC серверийн HTTPS холбоосыг Vercel дээр хараахан тохируулаагүй байна.</p>}
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}
      {edit ? <SettingsEditor settings={edit.settings} revision={edit.revision} save={saveSettings} close={() => setEdit(null)} /> : <button disabled={working || !status || !automation?.revision} onClick={() => { if (automation) setEdit({ settings: structuredClone(automation.settings), revision: automation.revision }); }} className="rounded-xl border bg-white px-5 py-3 text-sm font-bold disabled:opacity-40">Нэр, өрөө, горим засах</button>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[{ name: 'Холболт', value: status ? 'Холбогдсон' : 'Тасарсан', icon: Wifi }, { name: 'Нийт реле', value: '32', icon: Gauge }, { name: 'Асаалттай', value: status ? status.outputs.filter(Boolean).length : '—', icon: Power }, { name: 'Идэвхтэй оролт', value: status ? status.inputs.filter(Boolean).length : '—', icon: Activity }].map(card => <div key={card.name} className="rounded-2xl border bg-white p-5"><card.icon className="mb-3 h-5 w-5 text-sky-600" /><p className="text-xs text-slate-500">{card.name}</p><p className="mt-2 text-xl font-black text-slate-900">{card.value}</p></div>)}
      </div>
      <section className="rounded-2xl border bg-white p-5 sm:p-6">
        <h3 className="font-bold text-slate-900">Өрөө ба реле</h3>
        <div className="my-4 flex flex-wrap gap-2">{[{ id: 'all', name: 'Бүгд' }, ...(settings?.rooms || [])].map(r => <button key={r.id} onClick={() => setRoom(r.id)} className={`rounded-full px-4 py-2 text-sm ${room === r.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{r.name}</button>)}</div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{channels.map(c => {
          const on = Boolean(status?.outputs[c.id - 1]);
          return <button key={c.id} role="switch" aria-checked={on} aria-label={`${c.name} асаах унтраах`} disabled={!status || working} onClick={() => command('relay', { relay: c.id, state: on ? 'OFF' : 'ON' })} className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${status && on ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}><div className="flex items-center justify-between"><span className="font-mono text-xs text-slate-500">CH {String(c.id).padStart(2, '0')}</span><Power className={`h-4 w-4 ${status && on ? 'text-emerald-600' : 'text-slate-400'}`} /></div><p className="mt-3 break-words font-bold text-slate-900">{c.name}</p><p className="mt-1 text-xs text-slate-500">{settings?.rooms.find(r => r.id === c.room)?.name} · {!status ? 'Төлөв тодорхойгүй' : on ? 'Асаалттай' : 'Унтраалттай'}</p></button>;
        })}</div>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6"><h3 className="font-bold text-slate-900">Нэг товчийн горим</h3><div className="mt-4 space-y-3">{settings?.scenes.map(scene => { const values = Object.values(scene.commands); return <div key={scene.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><p className="font-semibold text-slate-900">{scene.name}</p><p className="mt-1 text-xs text-slate-500">{values.length ? `${values.filter(v => v === 1).length} асаах · ${values.filter(v => v === 0).length} унтраах` : 'Засах хэсгээс реле сонгоно уу'}</p></div><button disabled={!status || working || !values.length} onClick={() => command('scene', { id: scene.id })} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Ажиллуулах</button></div>; })}</div></section>
        <section className="rounded-2xl border bg-white p-6"><h3 className="flex items-center gap-2 font-bold text-slate-900"><Clock className="h-4 w-4" />Цагийн хуваарь</h3><p className="mt-3 text-xs leading-5 text-slate-500">Хуваарийг СӨХ-ийн PC дээрх локал аппд засна. PC сервер ажиллаж байх үед PC-ийн цагаар үйлчилнэ.</p><div className="mt-4 space-y-3">{settings?.schedules.map(s => <div key={s.id} className="rounded-xl bg-slate-50 p-4"><p className="font-semibold text-slate-900">{s.name} · {s.time}</p><p className="mt-1 text-xs text-slate-500">{s.days.map(d => dayNames[d]).join(', ')} · {s.enabled ? 'Идэвхтэй' : 'Идэвхгүй'}</p></div>)}</div></section>
      </div>
      <section className="rounded-2xl border bg-white p-6"><h3 className="font-bold text-slate-900">Оролтын төлөв</h3><div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">{Array.from({ length: 40 }, (_, i) => <div key={i} className={`rounded-lg p-2 text-center text-xs ${status?.inputs[i] ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}><p>DI {i + 1}</p><p className="mt-1">{!status ? '—' : status.inputs[i] ? 'Идэвхтэй' : 'Идэвхгүй'}</p></div>)}</div></section>
      <section className="rounded-2xl border bg-white p-6"><h3 className="font-bold text-slate-900">Үйлдлийн түүх</h3><div className="mt-4 divide-y">{automation?.events.slice(0, 10).map((e, i) => <div key={`${e.time}-${i}`} className="py-3"><p className={`text-sm ${e.ok ? 'text-slate-700' : 'text-rose-600'}`}>{e.text}</p><p className="mt-1 text-xs text-slate-400">{new Date(e.time).toLocaleString('mn-MN')}</p></div>)}</div></section>
    </div>
  );
}
