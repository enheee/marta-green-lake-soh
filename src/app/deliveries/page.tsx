'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Building,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { DeliveryItem } from '@/lib/types';

export default function DeliveriesPage() {
  const [unitQuery, setUnitQuery] = useState('');
  const [searchedUnit, setSearchedUnit] = useState('');
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDeliveries = async (unit = '') => {
    setLoading(true);
    try {
      const url = unit ? `/api/deliveries?unit=${encodeURIComponent(unit)}` : '/api/deliveries';
      const res = await fetch(url);
      if (res.ok) {
        setDeliveries(await res.json());
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedUnit(unitQuery.trim());
    fetchDeliveries(unitQuery.trim());
  };

  const handleMarkPickedUp = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/deliveries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setDeliveries((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: 'Хүлээн авсан' } : d))
        );
      }
    } catch (err) {
      alert('Алдаа гарлаа.');
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingItems = deliveries.filter((d) => d.status === 'Хүлээгдэж буй');
  const pickedUpItems = deliveries.filter((d) => d.status === 'Хүлээн авсан');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider">
          <Package className="w-3.5 h-3.5" />
          Жижүүрийн илгээмж & Хүргэлт
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Жижүүр дээрх илгээмж шалгах
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Хүргэлтийн компани, шуудангаас танай тоот дээр жижүүрт үлдээсэн илгээмж, барааг эндээс хянаарай.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Тоотоор хайх (Жишээ: 12)..."
              value={unitQuery}
              onChange={(e) => {
                setUnitQuery(e.target.value);
                if (!e.target.value) {
                  setSearchedUnit('');
                  fetchDeliveries('');
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Шалгах
          </button>
        </form>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Хүлээгдэж буй илгээмж: <strong>{pendingItems.length}</strong></span>
          {searchedUnit && (
            <button
              onClick={() => {
                setUnitQuery('');
                setSearchedUnit('');
                fetchDeliveries('');
              }}
              className="text-sky-600 hover:underline font-bold"
            >
              Бүгдийг харах
            </button>
          )}
        </div>
      </div>

      {/* Pending Items List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          {searchedUnit ? `${searchedUnit}-р тоотын аваагүй илгээмжүүд` : 'Жижүүр дээр аваагүй байгаа илгээмжүүд'}
        </h2>

        {pendingItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800">Хүлээгдэж буй илгээмж одоогоор алга</h3>
            <p className="text-xs text-slate-400">
              Таны тоот дээр шинэ илгээмж ирвэл жижүүр бүртгэж энд шууд харагдах болно.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 space-y-3 relative overflow-hidden ring-1 ring-amber-100"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-sky-600" />
                    {item.unitNumber}-р тоот
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Жижүүр дээр байна
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.courierCompany}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item.itemDescription}</p>
                  <span className="text-[11px] text-slate-400 block">Ирсэн огноо: {item.arrivedAt}</span>
                </div>

                {item.photoUrl && (
                  <div className="pt-1">
                    <img
                      src={item.photoUrl}
                      alt="Parcel"
                      className="h-28 w-full object-cover rounded-xl border border-slate-100 shadow-inner"
                    />
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleMarkPickedUp(item.id)}
                    disabled={updatingId === item.id}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Би очиж авсан</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Picked up history */}
      {pickedUpItems.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-600">Сүүлд авсан илгээмжүүдийн түүх</h3>
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {pickedUpItems.slice(0, 5).map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{item.unitNumber}-р тоот</span>
                  <span className="text-slate-500 ml-2">({item.courierCompany} - {item.itemDescription})</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Хүлээн авсан
                  </span>
                  <span className="text-[10px] text-slate-400 block">{item.pickedUpAt || item.arrivedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
