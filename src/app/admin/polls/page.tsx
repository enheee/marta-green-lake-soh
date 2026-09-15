'use client';

import { useState, useEffect } from 'react';
import {
  Vote,
  Plus,
  Trash2,
  Lock,
  Calendar,
  Users,
  CheckCircle2,
  X,
  PlusCircle,
} from 'lucide-react';
import { Poll } from '@/lib/types';

export default function AdminPollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [options, setOptions] = useState<string[]>(['Бүрэн дэмжиж байна', 'Дэмжихгүй байна']);
  const [newOptionText, setNewOptionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/polls');
      if (res.ok) {
        const data = await res.json();
        setPolls(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || options.length < 2) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          options,
          endDate: endDate || '2026-10-01',
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setTitle('');
        setDescription('');
        setOptions(['Бүрэн дэмжиж байна', 'Дэмжихгүй байна']);
        fetchPolls();
      } else {
        alert('Санал асуулга үүсгэхэд алдаа гарлаа.');
      }
    } catch (err) {
      alert('Холболтын алдаа.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClosePoll = async (pollId: string) => {
    if (!confirm('Энэ санал асуулгыг хаахдаа итгэлтэй байна уу?')) return;
    try {
      const res = await fetch('/api/polls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, action: 'close' }),
      });
      if (res.ok) {
        setPolls((prev) =>
          prev.map((p) => (p.id === pollId ? { ...p, status: 'Хаагдсан' } : p))
        );
      }
    } catch (err) {
      alert('Алдаа гарлаа.');
    }
  };

  const handleDeletePoll = async (id: string) => {
    if (!confirm('Энэ санал асуулгыг бүрмөсөн устгах уу?')) return;
    try {
      const res = await fetch(`/api/polls?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPolls((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert('Устгахад алдаа гарлаа.');
    }
  };

  const handleAddOption = () => {
    if (newOptionText.trim()) {
      setOptions([...options, newOptionText.trim()]);
      setNewOptionText('');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Санал асуулгын удирдлага</h2>
          <p className="text-xs text-slate-500">
            Оршин суугчдын дунд явуулах цахим санал асуулга үүсгэх, үр дүнг хянах, хаах
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Шинэ санал асуулга нээх</span>
        </button>
      </div>

      {/* Polls List */}
      <div className="space-y-4">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    poll.status === 'Идэвхтэй'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {poll.status}
                </span>
                <span className="text-xs text-slate-400">
                  Дуусах хугацаа: <strong>{poll.endDate}</strong>
                </span>
                <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-lg border">
                  Нийт: {poll.totalVotes} санал
                </span>
              </div>

              <div className="flex items-center gap-2">
                {poll.status === 'Идэвхтэй' && (
                  <button
                    onClick={() => handleClosePoll(poll.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1 border border-amber-200"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Хаах</span>
                  </button>
                )}
                <button
                  onClick={() => handleDeletePoll(poll.id)}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-100"
                  title="Устгах"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">{poll.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{poll.description}</p>
            </div>

            {/* Results preview */}
            <div className="space-y-2 pt-2">
              {poll.options.map((opt) => {
                const percent =
                  poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                return (
                  <div key={opt.id} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-700 font-semibold">
                      <span>{opt.text}</span>
                      <span>
                        {percent}% ({opt.votes} санал)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Шинэ санал асуулга үүсгэх</h3>
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
                  placeholder="Жишээ: Тоглоомын талбайн камержуулалт"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Дуусах огноо
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Тайлбар
                </label>
                <textarea
                  rows={3}
                  placeholder="Санал асуулгын нарийвчилсан мэдээлэл..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Сонголтууд (дор хаяж 2)
                </label>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[idx] = e.target.value;
                        setOptions(newOpts);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Шинэ сонголт бичих..."
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Нэмэх
                  </button>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
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
                  {submitting ? 'Үүсгэж байна...' : 'Нийтлэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
