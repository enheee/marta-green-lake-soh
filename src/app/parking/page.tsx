'use client';

import { useState, useEffect } from 'react';
import {
  Car,
  Search,
  Phone,
  PlusCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Building,
  User,
  Info,
} from 'lucide-react';
import { VehicleRecord } from '@/lib/types';

export default function ParkingPage() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Register vehicle form
  const [showRegister, setShowRegister] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [carModel, setCarModel] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const fetchVehicles = async (q = '') => {
    setLoading(true);
    try {
      const url = q ? `/api/vehicles?q=${encodeURIComponent(q)}` : '/api/vehicles';
      const res = await fetch(url);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles(searchQuery);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !unitNumber || !ownerPhone) return;

    setRegistering(true);
    setRegisteredSuccess(false);

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
        setRegisteredSuccess(true);
        setPlateNumber('');
        setUnitNumber('');
        setCarModel('');
        setOwnerName('');
        setOwnerPhone('');
        fetchVehicles();
        setTimeout(() => {
          setShowRegister(false);
          setRegisteredSuccess(false);
        }, 2000);
      } else {
        alert('Бүртгэхэд алдаа гарлаа.');
      }
    } catch (err) {
      alert('Холболтын алдаа.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider">
          <Car className="w-3.5 h-3.5" />
          Зогсоол & Автомашины бүртгэл
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Автомашины хайлт & Зогсоолын систем
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Бусдын орц гарц хаасан, зөрчил гаргасан автомашины улсын дугаараар эзэнтэй нь шууд холбогдоорой.
        </p>
      </div>

      {/* Action Bar: Search & Register Button */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Улсын дугаараар хайх (Жишээ: 1234 эсвэл 5566 УБН)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) fetchVehicles('');
              }}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold tracking-wider uppercase focus:outline-none focus:bg-white focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <span>Хайх</span>
          </button>
        </form>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            Нийт бүртгэлтэй: <strong>{vehicles.length}</strong> машин
          </span>
          <button
            onClick={() => setShowRegister(!showRegister)}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {showRegister ? 'Бүртгэх цонхыг хаах' : 'Өөрийн машинаа бүртгүүлэх'}
          </button>
        </div>
      </div>

      {/* Register Form Accordion */}
      {showRegister && (
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900">Шинэ автомашин бүртгүүлэх</h3>
          </div>

          {registeredSuccess ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 border border-emerald-200 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Таны автомашин амжилттай бүртгэгдлээ!
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Улсын дугаар *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: 1234 УБА"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Таны тоот *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: 12"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Марк, загвар, өнгө
                  </label>
                  <input
                    type="text"
                    placeholder="Жишээ: Prius 30 (Цагаан)"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Холбоо барих утас *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Жишээ: 99112233"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Эзэмшигчийн нэр
                </label>
                <input
                  type="text"
                  placeholder="Жишээ: Б.Батболд"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:border-sky-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={registering}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                {registering ? 'Бүртгэж байна...' : 'Автомашин бүртгүүлэх'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Vehicle Search Results Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Хайж байна...</div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
            <Car className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">Ийм автомашин бүртгэгдээгүй байна</h3>
            <p className="text-xs text-slate-400">
              Хэрэв тухайн машин гадны зочны машин бол жижүүрт мэдэгдэх боломжтой.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vehicles.map((veh) => (
              <div
                key={veh.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-sky-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-slate-900 text-white tracking-widest border border-slate-800 shadow-sm">
                    {veh.plateNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    <Building className="w-3.5 h-3.5" />
                    {veh.unitNumber}-р тоот
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-500">
                    Загвар: <strong className="text-slate-800">{veh.carModel}</strong>
                  </div>
                  <div className="text-slate-500">
                    Эзэмшигч: <strong className="text-slate-800">{veh.ownerName}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-700 text-xs">
                    {veh.ownerPhone}
                  </span>
                  <a
                    href={`tel:${veh.ownerPhone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Залгах</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Parking Etiquette Banner */}
      <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1 leading-relaxed">
          <strong className="block text-sm font-bold text-amber-950">
            Зогсоолын соёл & Санамж:
          </strong>
          <p>
            • Бусдын машиныг хааж зогсоосон тохиолдолд урд шилэн дээрээ холбогдох утасны дугаараа заавал ил үлдээнэ үү.
          </p>
          <p>• Явган хүний зам, хүүхдийн тоглоомын талбайн гарцыг хааж машин тавихыг хориглоно.</p>
        </div>
      </div>
    </div>
  );
}
