'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Building,
  Truck,
  RefreshCw,
  X,
  Check,
  Send,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { DeliveryItem } from '@/lib/types';

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Хүлээгдэж буй' | 'Хүлээн авсан'>('all');

  // New package modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [unitNumber, setUnitNumber] = useState('');
  const [courierCompany, setCourierCompany] = useState('Монгол шуудан');
  const [itemDescription, setItemDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/deliveries');
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber || !itemDescription) {
      alert('Тоот болон тайлбарыг заавал бөглөнө үү.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitNumber,
          courierCompany,
          itemDescription,
        }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setDeliveries((prev) => [newItem, ...prev]);
        setShowAddModal(false);
        setUnitNumber('');
        setItemDescription('');
      } else {
        alert('Бүртгэхэд алдаа гарлаа');
      }
    } catch (err) {
      console.error(err);
      alert('Сүлжээний алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPickedUp = async (id: string) => {
    try {
      const res = await fetch('/api/deliveries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        const updated = await res.json();
        setDeliveries((prev) =>
          prev.map((d) => (d.id === id ? updated : d))
        );
      }
    } catch (err) {
      console.error(err);
      alert('Алдаа гарлаа');
    }
  };

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.courierCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = deliveries.filter((d) => d.status === 'Хүлээгдэж буй').length;
  const deliveredCount = deliveries.filter((d) => d.status === 'Хүлээн авсан').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="w-7 h-7 text-amber-500" />
            Жижүүрийн илгээмжийн бүртгэл
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Хүргэлт, захиалга, бандеролийг бүртгэж, оршин суугчдад харуулах систем
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDeliveries}
            className="p-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm"
            title="Шинэчлэх"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition shadow-sm shadow-amber-200"
          >
            <Plus className="w-4 h-4" />
            Шинэ илгээмж бүртгэх
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Нийт илгээмж</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{deliveries.length}</p>
          </div>
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase">Жижүүр дээр байгаа</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase">Олгосон</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{deliveredCount}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Тоот, хүргэлтийн нэр, кодоор хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-medium">Төлөв:</span>
          {(['all', 'Хүлээгдэж буй', 'Хүлээн авсан'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Бүгд' : st === 'Хүлээгдэж буй' ? 'Жижүүр дээр' : 'Олгосон'}
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
                <th className="px-5 py-4">Код</th>
                <th className="px-5 py-4">Тоот</th>
                <th className="px-5 py-4">Хүргэлтийн газар</th>
                <th className="px-5 py-4">Тайлбар</th>
                <th className="px-5 py-4">Ирсэн цаг</th>
                <th className="px-5 py-4">Төлөв</th>
                <th className="px-5 py-4 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Уншиж байна...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Илгээмж бүртгэгдээгүй байна.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-amber-700">
                      {item.code}
                    </td>
                    <td className="px-5 py-4 font-black text-slate-900 text-base">
                      {item.unitNumber}-р тоот
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-bold border border-amber-200/50">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        {item.courierCompany}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium">
                      {item.itemDescription}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {item.arrivedAt}
                    </td>
                    <td className="px-5 py-4">
                      {item.status === 'Хүлээгдэж буй' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" />
                          Жижүүр дээр байгаа
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Хүлээн авсан
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {item.status === 'Хүлээгдэж буй' && (
                        <button
                          onClick={() => handleMarkPickedUp(item.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition inline-flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Олгосон
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              Шинэ илгээмж бүртгэх
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Жижүүр дээр орхисон хайрцаг, бандеролийг бүртгэх
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Тоот <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: 12, 402"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Хүргэлтийн үйлчилгээ
                </label>
                <select
                  value={courierCompany}
                  onChange={(e) => setCourierCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Монгол шуудан">Монгол шуудан (Mongol Post)</option>
                  <option value="Toki Delivery">Toki Delivery</option>
                  <option value="Shoppy">Shoppy хүргэлт</option>
                  <option value="CU / GS25">CU / GS25 хүргэлт</option>
                  <option value="Emart">Emart хүргэлт</option>
                  <option value="Хувь хүн / Шууданч">Хувь хүн / Шууданч</option>
                  <option value="Бусад хүргэлт">Бусад хүргэлт</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Илгээмжийн тайлбар <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: Жижиг бор хайрцаг, Шар ууттай зүйл"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-amber-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {saving ? 'Бүртгэж байна...' : 'Бүртгэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
