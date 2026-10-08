'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Search,
  AlertTriangle,
  PhoneCall,
  Bell,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MessageSquareWarning,
  FileCheck2,
  Wrench,
  Clock,
  ChevronRight,
  Sparkles,
  Vote,
  Car,
  Gauge,
  Package,
  Video,
  Receipt,
} from 'lucide-react';
import { Announcement, SohSettings } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [unitInput, setUnitInput] = useState('');
  const [settings, setSettings] = useState<SohSettings | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [settRes, annRes] = await Promise.all([
          fetch('/api/settings', { cache: 'no-store' }),
          fetch('/api/announcements', { cache: 'no-store' }),
        ]);
        if (settRes.ok) setSettings(await settRes.json());
        if (annRes.ok) setAnnouncements(await annRes.json());
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleBillSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (unitInput.trim()) {
      router.push(`/bills?unit=${encodeURIComponent(unitInput.trim())}`);
    }
  };

  const importantAnnouncements = announcements.filter((a) => a.isImportant);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {settings?.sohName || 'Marta Green Lake СӨХ'} • Цахим систем
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Тав тухтай, аюулгүй <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">
                орчныг хамтдаа
              </span>{' '}
              бүтээе
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
              СӨХ-ийн сарын төлбөрөө шалгах, эвдрэл гэмтлийн дуудлага илгээх, зарлал болон санхүүгийн ил тод тайланг нэг дороос хялбархан аваарай.
            </p>

            {/* Quick Bill Search Box in Hero */}
            <form
              onSubmit={handleBillSearch}
              className="bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 max-w-xl flex flex-col sm:flex-row gap-2 shadow-2xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  placeholder="Тоотоо оруулна уу (Жишээ: 12)"
                  value={unitInput}
                  onChange={(e) => setUnitInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/90 focus:bg-white text-slate-900 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Төлбөр шалгах</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 -mt-8 relative z-20">
        {/* Important Announcement Alert Banner */}
        {importantAnnouncements.length > 0 && (
          <div className="space-y-3">
            {importantAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 bg-white p-4 sm:p-5 rounded-r-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        Онцгой зарлал
                      </span>
                      <span className="text-xs text-slate-400">{ann.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{ann.title}</h3>
                    <p className="text-slate-600 text-sm mt-0.5 line-clamp-2">{ann.content}</p>
                  </div>
                </div>
                <Link
                  href="/announcements"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-lg self-start sm:self-center shrink-0 transition-colors"
                >
                  Дэлгэрэнгүй <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Smart Features Quick Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/bills"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-sky-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              Төлбөр шалгах & Нэхэмжлэх
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Тоотоо оруулан СӨХ-ийн хураамж, үлдэгдлээ шалгаж албан ёсны нэхэмжлэх татах.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 mt-4">
              Шалгах <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/meters"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Gauge className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Тоолуурын заалт илгээх
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Хүйтэн, халуун ус болон цахилгааны заалтаа фото зурагтай нь сар бүр цахимаар илгээх.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-4">
              Заалт оруулах <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/deliveries"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Жижүүрийн илгээмж
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Монгол шуудан, хүргэлтийн газруудаас жижүүрт үлдээсэн илгээмжээ тоотоороо шалгах.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 mt-4">
              Илгээмж харах <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/cctv"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              Камерын бичлэг шүүх
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Эд хөрөнгө, аюулгүй байдлын асуудлаар камерын бичлэг шүүх цахим хүсэлт гаргах.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 mt-4">
              Хүсэлт гаргах <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/parking"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
              Зогсоол & Зочны машин
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Улсын дугаараар эзнийг хайх болон зочны автомашиныг түр хугацаагаар бүртгэх.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 mt-4">
              Хайх / Бүртгэх <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/reports"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Шилэн СӨХ: Зарлагын чек
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              СӨХ-ийн сангийн орлого зарцуулалт, худалдан авалтын баримт чекийн нээлттэй архив.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-4">
              Архив үзэх <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/polls"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-purple-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Vote className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Цахим санал асуулга
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Хотхоны засвар тохижилт, дүрэм журам, төсвийн шийдвэрт өөрийн саналаа өгөх.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 mt-4">
              Санал өгөх <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/requests"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Гэмтэл, дуудлага өгөх
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Сантехник, цахилгаан, лифт, нийтийн эзэмшлийн эвдрэл гэмтлийн дуудлага илгээх.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 mt-4">
              Илгээх <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/announcements"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
              Зарлал, мэдээлэл
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Усны хязгаарлалт, халдваргүйжүүлэлт, СӨХ-ийн шуурхай мэдэгдлүүдийг харах.
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 mt-4">
              Харах <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* 2-Column Section: Emergency Contacts & Latest Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Announcements */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Сүүлийн үеийн зарлалууд</h2>
                <p className="text-xs text-slate-500 mt-0.5">СӨХ-ийн удирдах зөвлөлөөс гаргасан заруудыг дагана уу</p>
              </div>
              <Link
                href="/announcements"
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                Бүгдийг үзэх <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2.5 py-1 rounded-full font-semibold ${
                      ann.category === 'Яаралтай' ? 'bg-rose-50 text-rose-600' :
                      ann.category === 'Засвар' ? 'bg-amber-50 text-amber-700' :
                      ann.category === 'Төлбөр' ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ann.category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {ann.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{ann.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{ann.content}</p>
                  <div className="text-xs text-slate-400 pt-1 border-t border-slate-100 mt-1">
                    Нийтэлсэн: <span className="text-slate-600 font-medium">{ann.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 1 Col: Emergency Numbers & House Rules */}
          <div className="space-y-6">
            {/* Phone Directory */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-900">
                <PhoneCall className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-base">Шуурхай холбоо барих</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Эвдрэл, гэмтэл, тусламж хэрэгтэй үед шууд холбогдох утаснууд:
              </p>
              <div className="space-y-2.5">
                {settings?.emergencyPhones.map((phone, idx) => (
                  <a
                    key={idx}
                    href={`tel:${phone.phone.replace(/[^0-9]/g, '')}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-transparent transition-all group"
                  >
                    <div>
                      <span className="text-xs text-slate-500 block">{phone.title}</span>
                      <span className="text-sm font-bold text-slate-800">{phone.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-sky-600 bg-white group-hover:bg-sky-600 group-hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-200 group-hover:border-sky-600 transition-all flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" />
                      {phone.phone}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* House Rules Preview */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Байрны нийтлэг санамж</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>Ажлын өдрүүдэд 09:00 - 18:00 хооронд засвар хийх</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>Хогийг зориулалтын цэгт ууттай хаях</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>Орц гарц, явган хүний зам хааж зогсохгүй байх</span>
                </li>
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex justify-end">
                <Link
                  href="/reports"
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1"
                >
                  Бүрэн дүрмийг харах <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
