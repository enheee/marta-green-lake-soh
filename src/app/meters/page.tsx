'use client';

import { useState, useEffect } from 'react';
import {
  Gauge,
  Droplets,
  Zap,
  UploadCloud,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileCheck2,
  History,
  Image as ImageIcon,
} from 'lucide-react';
import { MeterReading } from '@/lib/types';

export default function MetersPage() {
  const [unitNumber, setUnitNumber] = useState('');
  const [coldWater, setColdWater] = useState('');
  const [hotWater, setHotWater] = useState('');
  const [electricity, setElectricity] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<MeterReading[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const currentPeriod = `${new Date().getFullYear()} оны ${new Date().getMonth() + 1}-р сар`;

  useEffect(() => {
    if (unitNumber.trim()) {
      fetchUnitHistory(unitNumber.trim());
    } else {
      setHistory([]);
    }
  }, [unitNumber]);

  const fetchUnitHistory = async (unit: string) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/meters?unit=${encodeURIComponent(unit)}`);
      if (res.ok) {
        setHistory(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber || !coldWater || !hotWater) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/meters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitNumber,
          period: currentPeriod,
          coldWater: Number(coldWater),
          hotWater: Number(hotWater),
          electricity: electricity ? Number(electricity) : undefined,
          photoUrl: photoUrl || undefined,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setColdWater('');
        setHotWater('');
        setElectricity('');
        setPhotoUrl(null);
        fetchUnitHistory(unitNumber);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        alert('Заалт илгээхэд алдаа гарлаа.');
      }
    } catch (err) {
      alert('Холболтын алдаа гарлаа.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold uppercase tracking-wider">
          <Gauge className="w-3.5 h-3.5" />
          Хэрэглээний тоолуурын хэсэг
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Ус, Цахилгааны тоолуурын заалт илгээх
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Сар бүрийн 20-25-ны хооронд халуун, хүйтэн усны тоолуурын заалтаа илгээнэ үү. Систем шууд СӨХ болон конторын тайланд нэгтгэнэ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Хамаарах хугацаа: <strong>{currentPeriod}</strong></span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Хугацаа: Сарын 20-25
            </span>
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Таны тоолуурын заалтыг амжилттай бүртгэлээ!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Тоот *
              </label>
              <input
                type="text"
                required
                placeholder="Жишээ: 12"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:bg-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 space-y-2">
                <label className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  Хүйтэн усны заалт (м³) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Жишээ: 142.5"
                  value={coldWater}
                  onChange={(e) => setColdWater(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 block">Цэнхэр өнгийн тоолуур</span>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 space-y-2">
                <label className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-rose-600" />
                  Халуун усны заалт (м³) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Жишээ: 88.2"
                  value={hotWater}
                  onChange={(e) => setHotWater(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-[10px] text-slate-400 block">Улаан өнгийн тоолуур</span>
              </div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-2">
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                Цахилгааны заалт (кВт.ц - Сонголтоор)
              </label>
              <input
                type="number"
                placeholder="Жишээ: 3420"
                value={electricity}
                onChange={(e) => setElectricity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Тоолуурын зураг хавсаргах (Сонголтоор)
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-cyan-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-cyan-50/40 transition-colors">
                {photoUrl ? (
                  <div className="space-y-1 text-center">
                    <img src={photoUrl} alt="Meter preview" className="max-h-28 rounded-lg mx-auto shadow-sm" />
                    <span className="text-[11px] text-cyan-700 font-bold block">Зургийг солих</span>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <ImageIcon className="w-7 h-7 text-slate-400 mx-auto" />
                    <span className="text-xs font-bold text-slate-700 block">Зураг сонгох / камераар дарах</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-sm shadow-sm transition-all"
            >
              {submitting ? 'Илгээж байна...' : 'Тоолуурын заалт илгээх'}
            </button>
          </form>
        </div>

        {/* History Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-600" />
              {unitNumber ? `${unitNumber}-р тоотын түүх` : 'Өмнөх заалтын түүх'}
            </h3>

            {!unitNumber ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Тоотоо оруулснаар өмнөх саруудын өгсөн заалтууд харагдана.
              </p>
            ) : loadingHistory ? (
              <p className="text-xs text-slate-400 py-4 text-center">Уншиж байна...</p>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Энэ тоот дээр бүртгэгдсэн заалт одоогоор алга байна.
              </p>
            ) : (
              <div className="space-y-2.5">
                {history.map((h) => (
                  <div key={h.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{h.period}</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {h.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Хүйтэн: <strong>{h.coldWater} м³</strong></span>
                      <span>Халуун: <strong>{h.hotWater} м³</strong></span>
                    </div>
                    {h.electricity && (
                      <div className="text-slate-500 text-[11px]">
                        Цахилгаан: <strong>{h.electricity} кВт.ц</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-2 text-xs leading-relaxed">
            <h4 className="font-bold text-sm text-cyan-300">Санамж:</h4>
            <p>• Заалтыг таслалтай цифрийг оруулахдаа цэг (.) ашиглана уу.</p>
            <p>• Эргэлзээтэй заалт гарсан тохиолдолд тоолуурын зургийг хавсаргаж илгээнэ үү.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
