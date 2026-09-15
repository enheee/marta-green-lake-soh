'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  Phone,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { ComplaintRequest } from '@/lib/types';

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'track'>('create');
  const [requests, setRequests] = useState<ComplaintRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [unitNumber, setUnitNumber] = useState('');
  const [residentName, setResidentName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<ComplaintRequest['category']>('Сантехник');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // Track search
  const [trackQuery, setTrackQuery] = useState('');

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/requests');
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
    loadRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber || !phone || !description) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitNumber,
          residentName,
          phone,
          category,
          title: title || `${category} - ${unitNumber}-р тоот`,
          description,
        }),
      });

      if (res.ok) {
        const created: ComplaintRequest = await res.json();
        setSubmittedCode(created.code);
        // Reset form
        setTitle('');
        setDescription('');
        loadRequests();
      } else {
        alert('Хүсэлт илгээхэд алдаа гарлаа.');
      }
    } catch (err) {
      alert('Холболтын алдаа.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (!trackQuery.trim()) return true;
    const q = trackQuery.toLowerCase().trim();
    return (
      r.code.toLowerCase().includes(q) ||
      r.unitNumber.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          Оршин суугчдын хүсэлт, гомдол
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Гэмтлийн дуудлага & Санал хүсэлт
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Байрны нийтийн эзэмшлийн эвдрэл гэмтэл болон санал хүсэлтээ илгээж, шийдвэрлэлтийн явцыг шууд хянаарай.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex gap-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-sky-600" />
            Шинэ дуудлага илгээх
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'track'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4 text-amber-600" />
            Явц шалгах ({requests.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Submit Form */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          {submittedCode ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Таны хүсэлтийг хүлээн авлаа!
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                СӨХ-ийн хариуцсан инженер, ажилтан таны хүсэлттэй танилцан холбогдох болно.
              </p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
                <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                  Хяналтын дугаар
                </span>
                <span className="text-2xl font-mono font-black text-sky-600">
                  {submittedCode}
                </span>
              </div>
              <div>
                <button
                  onClick={() => {
                    setSubmittedCode(null);
                    setActiveTab('track');
                    setTrackQuery(submittedCode);
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Шийдвэрлэлтийн явц харах
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Тоот *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: 12"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Утасны дугаар *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Жишээ: 99112233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Оршин суугчийн нэр
                  </label>
                  <input
                    type="text"
                    placeholder="Жишээ: Б.Болд"
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Эвдрэлийн төрөл *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Сантехник">Сантехник (Ус, бохир, паар)</option>
                    <option value="Цахилгаан">Цахилгаан (Гэрэл, щит)</option>
                    <option value="Лифт">Лифт засвар үйлчилгээ</option>
                    <option value="Цэвэрлэгээ">Орц, гадна цэвэрлэгээ</option>
                    <option value="Орчны дуу чимээ">Орчны дуу чимээ, зөрчил</option>
                    <option value="Бусад">Бусад санал хүсэлт</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Гарчиг (товч)
                </label>
                <input
                  type="text"
                  placeholder="Жишээ: 3 давхрын коридорын гэрэл асахгүй байна"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Дэлгэрэнгүй тайлбар *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Эвдрэл, асуудлын талаар тодорхой тайлбарлана уу..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Илгээж байна...' : 'Дуудлага / Хүсэлт илгээх'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: Track Requests */}
      {activeTab === 'track' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Хяналтын код (REQ-101) эсвэл тоотоор хайх..."
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      {req.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {req.unitNumber}-р тоот
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{req.category}</span>
                  </div>

                  <div>
                    {req.status === 'Шийдвэрлэсэн' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Шийдвэрлэсэн
                      </span>
                    ) : req.status === 'Хянаж байна' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                        <Clock className="w-3.5 h-3.5" /> Хянаж байна
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" /> Хүлээгдэж буй
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{req.title}</h3>
                  <p className="text-slate-600 text-sm mt-1">{req.description}</p>
                </div>

                {/* Admin Note if available */}
                {req.adminNote && (
                  <div className="bg-sky-50/70 border border-sky-100 p-3 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-sky-900 block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> СӨХ-ийн хариу:
                    </span>
                    <p className="text-sky-800">{req.adminNote}</p>
                  </div>
                )}

                <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                  <span>Огноо: {req.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
