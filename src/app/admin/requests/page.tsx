'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Save,
  User,
} from 'lucide-react';
import { ComplaintRequest } from '@/lib/types';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ComplaintRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data: ComplaintRequest[] = await res.json();
        setRequests(data);
        const initialNotes: { [id: string]: string } = {};
        data.forEach((r) => {
          initialNotes[r.id] = r.adminNote || '';
        });
        setNotes(initialNotes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: ComplaintRequest['status']) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
          adminNote: notes[id],
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      }
    } catch (err) {
      alert('Төлөв өөрчлөхөд алдаа гарлаа.');
    }
  };

  const handleSaveNote = async (id: string, currentStatus: ComplaintRequest['status']) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: currentStatus,
          adminNote: notes[id],
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        alert('Тэмдэглэл хадгалагдлаа!');
      }
    } catch (err) {
      alert('Алдаа гарлаа.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Ирсэн дуудлага & Санал хүсэлтийн удирдлага
        </h2>
        <p className="text-xs text-slate-500">
          Оршин суугчдаас ирсэн эвдрэл гэмтэл, засварын хүсэлтийн шийдвэрлэлтийг хянаж, хариу тэмдэглэл өгөх
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
          >
            {/* Top header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded">
                  {req.code}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {req.unitNumber}-р тоот
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {req.category}
                </span>
                <span className="text-xs text-slate-400">• {req.createdAt}</span>
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 font-semibold">Төлөв:</label>
                <select
                  value={req.status}
                  onChange={(e) =>
                    handleStatusChange(req.id, e.target.value as ComplaintRequest['status'])
                  }
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                    req.status === 'Шийдвэрлэсэн'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : req.status === 'Хянаж байна'
                      ? 'bg-sky-50 text-sky-800 border-sky-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  <option value="Хүлээгдэж буй">Хүлээгдэж буй</option>
                  <option value="Хянаж байна">Хянаж байна</option>
                  <option value="Шийдвэрлэсэн">Шийдвэрлэсэн</option>
                </select>
              </div>
            </div>

            {/* Content & Resident Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{req.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {req.description}
                </p>
              </div>

              {/* Resident contacts */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">
                  Холбоо барих мэдээлэл
                </span>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{req.residentName}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-slate-700 font-semibold">{req.phone}</span>
                  <a
                    href={`tel:${req.phone.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-1 text-sky-600 hover:text-sky-700 font-bold bg-white px-2 py-1 rounded-lg border border-slate-200"
                  >
                    <Phone className="w-3 h-3" /> Залгах
                  </a>
                </div>
              </div>
            </div>

            {/* Admin Response Note */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Оршин суугчид харагдах СӨХ-ийн хариу тайлбар (Жишээ: Сантехникч үзэхээр товлосон)..."
                  value={notes[req.id] || ''}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [req.id]: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleSaveNote(req.id, req.status)}
                disabled={savingId === req.id}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingId === req.id ? 'Хадгалж байна...' : 'Хариу хадгалах'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
