'use client';

import { useState, useEffect } from 'react';
import {
  Car,
  Search,
  Plus,
  Trash2,
  Phone,
  Building,
  Download,
  X,
  CheckCircle2,
} from 'lucide-react';
import { VehicleRecord } from '@/lib/types';

export default function AdminParkingPage() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [carModel, setCarModel] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vehicles');
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !unitNumber || !ownerPhone) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plateNumber,
          unitNumber,
          carModel,
          ownerName,
          ownerPhone,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setPlateNumber('');
        setUnitNumber('');
        setCarModel('');
        setOwnerName('');
        setOwnerPhone('');
        fetchVehicles();
      } else {
        alert('Бүртгэхэд алдаа гарлаа.');
      }
    } catch (err) {
      alert('Холболтын алдаа.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ автомашины бүртгэлийг устгах уу?')) return;
    try {
      const res = await fetch(`/api/vehicles?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      alert('Устгахад алдаа гарлаа.');
    }
  };

  const exportCSV = () => {
    const headers = ['Улсын дугаар', 'Тоот', 'Марк/Загвар', 'Эзэмшигч', 'Утас', 'Бүртгэсэн огноо'];
    const rows = vehicles.map((v) => [
      v.plateNumber,
      v.unitNumber,
      v.carModel,
      v.ownerName,
      v.ownerPhone,
      v.registeredAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `marta_vehicles_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      v.plateNumber.toLowerCase().includes(q) ||
      v.unitNumber.includes(q) ||
      v.ownerPhone.includes(q) ||
      v.ownerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Автомашин & Зогсоолын бүртгэл</h2>
          <p className="text-xs text-slate-500">
            Нийт {vehicles.length} машин бүртгэгдсэн байна. Улсын дугаараар эзнийг тодорхойлох боломжтой.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Excel татах</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Машин бүртгэх</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Улсын дугаар, тоот, утсаар хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-sky-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Улсын дугаар</th>
                <th className="py-3.5 px-4">Тоот</th>
                <th className="py-3.5 px-4">Марк / Загвар</th>
                <th className="py-3.5 px-4">Эзэмшигч</th>
                <th className="py-3.5 px-4">Утасны дугаар</th>
                <th className="py-3.5 px-4 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs border">
                      {v.plateNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-sky-700">{v.unitNumber}-р тоот</td>
                  <td className="py-3 px-4 text-slate-700">{v.carModel}</td>
                  <td className="py-3 px-4 text-slate-900">{v.ownerName}</td>
                  <td className="py-3 px-4">
                    <a
                      href={`tel:${v.ownerPhone.replace(/[^0-9]/g, '')}`}
                      className="font-mono font-bold text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {v.ownerPhone}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-100"
                      title="Устгах"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Шинэ автомашин бүртгэх</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Улсын дугаар *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 УБА"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold uppercase focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Тоот *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Марк, загвар, өнгө
                </label>
                <input
                  type="text"
                  placeholder="Toyota Prius 30 (Цагаан)"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Эзэмшигчийн нэр
                  </label>
                  <input
                    type="text"
                    placeholder="Б.Батболд"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Утасны дугаар *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="99112233"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm"
                >
                  {submitting ? 'Бүртгэж байна...' : 'Бүртгэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
