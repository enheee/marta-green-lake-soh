'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  AlertTriangle,
  Calendar,
  User,
  Tag,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { Announcement } from '@/lib/types';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Бүгд');

  useEffect(() => {
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Бүгд', 'Яаралтай', 'Засвар', 'Цэвэрлэгээ', 'Төлбөр', 'Хурал'];

  const filtered = announcements.filter((ann) => {
    const matchesCategory =
      selectedCategory === 'Бүгд' || ann.category === selectedCategory;
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <Bell className="w-3.5 h-3.5" />
          СӨХ-ийн мэдээллийн самбар
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Зарлал & Сэрэмжлүүлэг
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Байрны цахилгаан, дулаан, засвар үйлчилгээ, их цэвэрлэгээ болон оршин суугчдын хурлын талаарх хамгийн сүүлийн үеийн мэдээллүүд.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Зарлалын гарчиг, түлхүүр үгээр хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-sky-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Ачаалж байна...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">Зарлал олдсонгүй</h3>
          <p className="text-xs text-slate-400">Шүүлтүүр эсвэл хайлтын утгаа өөрчилж үзнэ үү.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ann) => (
            <article
              key={ann.id}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                ann.isImportant
                  ? 'border-amber-300 shadow-amber-100 shadow-md ring-1 ring-amber-200'
                  : 'border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ann.category === 'Яаралтай'
                        ? 'bg-rose-100 text-rose-700'
                        : ann.category === 'Засвар'
                        ? 'bg-amber-100 text-amber-800'
                        : ann.category === 'Төлбөр'
                        ? 'bg-sky-100 text-sky-800'
                        : ann.category === 'Цэвэрлэгээ'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ann.category}
                  </span>
                  {ann.isImportant && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" /> Онцгой
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {ann.author}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">{ann.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
