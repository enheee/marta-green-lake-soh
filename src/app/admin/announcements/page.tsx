'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  AlertTriangle,
  Calendar,
  User,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Announcement } from '@/lib/types';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Бусад');
  const [isImportant, setIsImportant] = useState(false);
  const [author, setAuthor] = useState('СӨХ-ийн Удирдах зөвлөл');
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          isImportant,
          author,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setTitle('');
        setContent('');
        setIsImportant(false);
        fetchAnnouncements();
      } else {
        alert('Зарлал нийтлэхэд алдаа гарлаа.');
      }
    } catch (err) {
      alert('Холболтын алдаа.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ зарлалыг устгахдаа итгэлтэй байна уу?')) return;

    try {
      const res = await fetch(`/api/announcements?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      alert('Устгахад алдаа гарлаа.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Зарлал, сэрэмжлүүлэг удирдах</h2>
          <p className="text-xs text-slate-500">
            Оршин суугчдад харагдах зарлалуудыг оруулах, засах болон устгах
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Шинэ зарлал нийтлэх</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col sm:flex-row justify-between gap-4 ${
              ann.isImportant ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {ann.category}
                </span>
                {ann.isImportant && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Онцгой зарлал
                  </span>
                )}
                <span className="text-xs text-slate-400">• {ann.date}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900">{ann.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>
              <div className="text-[11px] text-slate-400">
                Зохиогч: <span className="font-semibold text-slate-600">{ann.author}</span>
              </div>
            </div>

            <div className="sm:self-center">
              <button
                onClick={() => handleDelete(ann.id)}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors border border-rose-100"
                title="Устгах"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Шинэ зарлал нийтлэх</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Гарчиг *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: Цахилгааны түр хязгаарлалт"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ангилал
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Яаралтай">Яаралтай</option>
                    <option value="Засвар">Засвар</option>
                    <option value="Цэвэрлэгээ">Цэвэрлэгээ</option>
                    <option value="Төлбөр">Төлбөр</option>
                    <option value="Хурал">Хурал</option>
                    <option value="Бусад">Бусад</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Зохиогч
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="importantCheck"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="importantCheck" className="text-xs font-bold text-slate-700">
                  Онцгой сэрэмжлүүлэг болгон нүүр хуудасны дээр тодруулж харуулах
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Зарлалын дэлгэрэнгүй агуулга *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Зарлалын дэлгэрэнгүй тайлбар..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs leading-relaxed focus:bg-white focus:border-sky-500 focus:outline-none"
                />
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
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm"
                >
                  {submitting ? 'Нийтэлж байна...' : 'Нийтлэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
