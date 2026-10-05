'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Filter,
  Phone,
  Calendar,
  MapPin,
  RefreshCw,
  X,
  FileText,
  User,
} from 'lucide-react';
import { CctvRequest } from '@/lib/types';

export default function AdminCctvPage() {
  const [requests, setRequests] = useState<CctvRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CctvRequest['status']>('all');

  // Status edit modal
  const [selectedReq, setSelectedReq] = useState<CctvRequest | null>(null);
  const [newStatus, setNewStatus] = useState<CctvRequest['status']>('Шалгаж байна');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cctv');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    setUpdating(true);
    try {
      const res = await fetch('/api/cctv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedReq.id,
          status: newStatus,
          adminNote: adminNotes,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === selectedReq.id ? updated : r))
        );
        setSelectedReq(null);
      } else {
        alert('Шинэчлэхэд алдаа гарлаа');
      }
    } catch (err) {
      console.error(err);
      alert('Сүлжээний алдаа гарлаа');
    } finally {
      setUpdating(false);
    }
  };

  const openEditModal = (r: CctvRequest) => {
    setSelectedReq(r);
    setNewStatus(r.status);
    setAdminNotes(r.adminNote || '');
  };

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === 'Хүлээгдэж буй').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Video className="w-7 h-7 text-indigo-600" />
            Камерын бичлэг шүүх хүсэлтүүд
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Оршин суугчдын гаргасан камерын бичлэг үзэх хүсэлтийг хянах, шийдвэрлэх
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            className="p-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm"
            title="Шинэчлэх"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Тоот, утас, код, шалтгаанаар хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'Хүлээгдэж буй', 'Шалгаж байна', 'Бичлэг олдсон', 'Шийдвэрлэсэн'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all'
                ? 'Бүгд'
                : st === 'Хүлээгдэж буй'
                ? `Шинэ (${pendingCount})`
                : st}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Уншиж байна...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">Хүсэлт олдсонгүй.</div>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {req.code}
                      </span>
                      <span className="font-black text-slate-900 text-base">{req.unitNumber}-р тоот</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <a href={`tel:${req.phone}`} className="text-indigo-600 hover:underline">
                          {req.phone}
                        </a>
                      </span>
                      <span>•</span>
                      <span>{req.createdAt}</span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        req.status === 'Хүлээгдэж буй'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'Шалгаж байна'
                          ? 'bg-sky-100 text-sky-800'
                          : req.status === 'Бичлэг олдсон'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs text-slate-700 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">Огноо/Цаг:</span> {req.date} | {req.timeRange}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">Байршил:</span> {req.location}
                  </div>
                  <div className="pt-1 border-t border-slate-200/60">
                    <p className="font-semibold text-slate-900 mb-0.5">Шалтгаан:</p>
                    <p className="text-slate-700">{req.reason}</p>
                  </div>
                  {req.adminNote && (
                    <div className="pt-1 text-indigo-700 italic border-t border-slate-200/40">
                      СӨХ-ийн хариу: {req.adminNote}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-400">ID: {req.id}</span>
                <button
                  onClick={() => openEditModal(req)}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition"
                >
                  Төлөв шийдвэрлэх
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Status Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedReq(null)}
              className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-1">
              Хүсэлт шийдвэрлэх ({selectedReq.code})
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              {selectedReq.unitNumber}-р тоот • Утас: {selectedReq.phone}
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Шийдвэрийн төлөв
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as CctvRequest['status'])}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  <option value="Хүлээгдэж буй">Хүлээгдэж буй</option>
                  <option value="Шалгаж байна">Шалгаж байна (Бичлэг хайж буй)</option>
                  <option value="Бичлэг олдсон">Бичлэг олдсон (Утсаар холбогдох)</option>
                  <option value="Шийдвэрлэсэн">Шийдвэрлэсэн (Шүүж дууссан)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  СӨХ-ийн хариу тайлбар / Тэмдэглэл
                </label>
                <textarea
                  rows={3}
                  placeholder="Жишээ: 18:30 цагт харуулын байранд ирж бичлэг хамт шүүхээр тохиров."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  {updating ? 'Шинэчилж байна...' : 'Хадгалах'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
