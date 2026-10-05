'use client';

import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Droplets,
  Zap,
  Image as ImageIcon,
  X,
  RefreshCw,
  Building,
} from 'lucide-react';
import { MeterReading } from '@/lib/types';

export default function AdminMetersPage() {
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Шинэ' | 'Хянагдсан'>('all');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meters');
      if (res.ok) {
        const data = await res.json();
        setReadings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleUpdateStatus = async (id: string, status: MeterReading['status']) => {
    try {
      const res = await fetch('/api/meters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setReadings((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error(err);
      alert('Алдаа гарлаа');
    }
  };

  const handleExportCSV = () => {
    if (readings.length === 0) {
      alert('Экспортлох өгөгдөл байхгүй байна');
      return;
    }

    const headers = [
      'Тоот',
      'Хугацаа/Сар',
      'Хүйтэн ус (м3)',
      'Халуун ус (м3)',
      'Цахилгаан (кВт)',
      'Төлөв',
      'Илгээсэн огноо',
    ];

    const rows = filteredReadings.map((r) => [
      `"${r.unitNumber}"`,
      `"${r.period}"`,
      r.coldWater,
      r.hotWater,
      r.electricity ?? '',
      r.status,
      `"${r.submittedAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tooluur_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReadings = readings.filter((r) => {
    const matchesSearch =
      r.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.period.includes(searchQuery) ||
      (r.residentName && r.residentName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' ? true : r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = readings.length;
  const verifiedCount = readings.filter((r) => r.status === 'Хянагдсан').length;
  const pendingCount = readings.filter((r) => r.status === 'Шинэ').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Gauge className="w-7 h-7 text-indigo-600" />
            Тоолуурын заалт хянах самбар
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Оршин суугчдын илгээсэн ус, цахилгааны заалтыг шалгах, ОСНААУГ болон УБЦТС-д зориулан экспортлох
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReadings}
            className="p-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm"
            title="Шинэчлэх"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            CSV / Excel экспорт
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Нийт заалт</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Gauge className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase">Шалгах (Шинэ)</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase">Хянагдсан</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{verifiedCount}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Тоот эсвэл сараар хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Төлөв:</span>
          {(['all', 'Шинэ', 'Хянагдсан'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Бүгд' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-4">Тоот</th>
                <th className="px-5 py-4">Сар</th>
                <th className="px-5 py-4">Хүйтэн ус</th>
                <th className="px-5 py-4">Халуун ус</th>
                <th className="px-5 py-4">Цахилгаан</th>
                <th className="px-5 py-4">Зураг</th>
                <th className="px-5 py-4">Огноо</th>
                <th className="px-5 py-4">Төлөв</th>
                <th className="px-5 py-4 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                    Уншиж байна...
                  </td>
                </tr>
              ) : filteredReadings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                    Заалт олдсонгүй.
                  </td>
                </tr>
              ) : (
                filteredReadings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {r.unitNumber}-р тоот
                      {r.residentName && <span className="block text-[11px] text-slate-400 font-normal">{r.residentName}</span>}
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-mono text-xs">
                      {r.period}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-blue-600 font-mono text-xs font-bold">
                        <Droplets className="w-3.5 h-3.5" />
                        {r.coldWater} м³
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-rose-500 font-mono text-xs font-bold">
                        <Droplets className="w-3.5 h-3.5" />
                        {r.hotWater} м³
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {r.electricity !== undefined ? (
                        <div className="flex items-center gap-1.5 text-amber-600 font-mono text-xs font-bold">
                          <Zap className="w-3.5 h-3.5" />
                          {r.electricity} кВт
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {r.photoUrl ? (
                        <button
                          onClick={() => setPreviewPhoto(r.photoUrl!)}
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:underline"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          Харах
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {r.submittedAt}
                    </td>
                    <td className="px-5 py-4">
                      {r.status === 'Хянагдсан' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Хянагдсан
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" />
                          Шинэ
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {r.status === 'Шинэ' ? (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'Хянагдсан')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                        >
                          Хянасан
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'Шинэ')}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition"
                        >
                          Буцаах
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 relative shadow-2xl">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 mb-3 px-2">Тоолуурын заалтын фото зураг</h3>
            <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center max-h-[70vh]">
              <img
                src={previewPhoto}
                alt="Meter photo"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
