'use client';

import React, { useState } from 'react';
import { Video, ShieldAlert, Clock, Calendar, MapPin, Send, CheckCircle2, AlertCircle, FileText, Phone, Building } from 'lucide-react';

export default function CctvRequestPage() {
  const [unitNumber, setUnitNumber] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeRange, setTimeRange] = useState('');
  const [location, setLocation] = useState('Гадна зогсоол (урд тал)');
  const [reason, setReason] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestCode, setRequestCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber || !phone || !timeRange || !location || !reason) {
      alert('Бүх шаардлагатай талбарыг бөглөнө үү.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/cctv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitNumber,
          phone,
          date,
          timeRange,
          location,
          reason: applicantName ? `${applicantName}: ${reason}` : reason,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRequestCode(data.code || data.id);
        setSubmitted(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Хүсэлт илгээхэд алдаа гарлаа');
      }
    } catch {
      alert('Сүлжээний алдаа гарлаа');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold mb-3 border border-indigo-500/30">
              <Video className="w-3.5 h-3.5" />
              Аюулгүй байдал & Хяналт
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Камерын бичлэг шүүх хүсэлт</h1>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              Хувийн нууц болон СӨХ-ийн дотоод журмын дагуу оршин суугчийн цахимаар илгээсэн хүсэлтийг удирдлагын баг хянаж, зөвшөөрөгдсөн тохиолдолд бичлэг шүүнэ.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="block text-2xl font-black text-amber-400">24/7</span>
            <span className="text-xs text-slate-300">Камерын архивлалт</span>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Хүсэлт амжилттай илгээгдлээ!</h2>
          <p className="text-slate-600 text-sm">
            Хүсэлтийн код: <span className="font-mono font-bold text-indigo-600 text-base">{requestCode}</span>
            <br />
            СӨХ-ийн харуул хамгаалалтын алба таны хүсэлтийг хүлээн авлаа. Хүсэлтийг нягтлан үзээд таны{' '}
            <span className="font-semibold text-slate-800">{phone}</span> дугаарт холбогдоно.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left text-xs text-amber-900 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Санамж:</p>
              Эд хөрөнгийн ноцтой хохирол, гэмт хэргийн шинжтэй тохиолдолд Цагдаагийн 102 дугаарт хандаж албан ёсны бичигтэй ирэхийг зөвлөж байна.
            </div>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setUnitNumber('');
              setApplicantName('');
              setPhone('');
              setTimeRange('');
              setReason('');
            }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition shadow-sm"
          >
            Өөр хүсэлт гаргах
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rules / Guidance */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                Бичлэг шүүх журам
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <span>Зөвхөн өөрийн эд хөрөнгө, аюулгүй байдалтай холбоотой тохиолдолд шүүнэ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <span>Бусад оршин суугчдын хувийн нууцыг хамгаалах үүднээс бичлэгийг хуулбарлаж олгохгүй, харуулын өрөөнд хамт үзүүлнэ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <span>Бичлэг хадгалагдах хугацаа 14-30 хоног тул цаг алдалгүй хүсэлт гаргана уу.</span>
                </li>
              </ul>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 text-indigo-900">
              <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Шийдвэрлэх хугацаа
              </h4>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Хүсэлтийг ажлын цагаар (09:00 - 18:00) 2-4 цагийн дотор хянаж хариу өгнө.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-5">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Хүсэлтийн мэдээлэл бөглөх
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Тоот <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: 12, 402"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Хүсэлт гаргагчийн нэр
                  </label>
                  <input
                    type="text"
                    placeholder="Овог нэр"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Холбогдох утасны дугаар <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Жишээ: 99112233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    Огноо <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    Цагийн интервал <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: 14:00 - 15:30"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                  Камерын байршил <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Гадна зогсоол (урд тал)">Гадна зогсоол (урд тал)</option>
                  <option value="Гадна зогсоол (хойд тал)">Гадна зогсоол (хойд тал)</option>
                  <option value="1-р орц, үүдний хэсэг">1-р орц, үүдний хэсэг</option>
                  <option value="2-р орц, үүдний хэсэг">2-р орц, үүдний хэсэг</option>
                  <option value="1-р орц, лифт">1-р орц, лифт</option>
                  <option value="2-р орц, лифт">2-р орц, лифт</option>
                  <option value="Хүүхдийн тоглоомын талбай">Хүүхдийн тоглоомын талбай</option>
                  <option value="B1 дулаан зогсоол">B1 дулаан зогсоол</option>
                  <option value="Хогийн цэг орчим">Хогийн цэг орчим</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  <FileText className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                  Шалтгаан <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Жишээ: Гадаа зогсоолд байсан машины баруун хаалгыг үл таних машин шүргээд явсан байсан тул дугаарыг нь харах шаардлагатай."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Илгээж байна...' : 'Хүсэлт илгээх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
