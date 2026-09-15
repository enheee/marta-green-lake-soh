'use client';

import { useState, useEffect } from 'react';
import {
  Vote,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Users,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Poll } from '@/lib/types';

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  // Voting state per poll
  const [selectedOptions, setSelectedOptions] = useState<{ [pollId: string]: string }>({});
  const [unitInputs, setUnitInputs] = useState<{ [pollId: string]: string }>({});
  const [votingPollId, setVotingPollId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<{ [pollId: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState<{ [pollId: string]: string }>({});

  const fetchPolls = async () => {
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

  const handleVote = async (pollId: string) => {
    const optionId = selectedOptions[pollId];
    const unitNumber = unitInputs[pollId];

    if (!optionId) {
      setErrorMsg((prev) => ({ ...prev, [pollId]: 'Та сонголтоо хийнэ үү' }));
      return;
    }
    if (!unitNumber || !unitNumber.trim()) {
      setErrorMsg((prev) => ({ ...prev, [pollId]: 'Тоотоо оруулна уу' }));
      return;
    }

    setVotingPollId(pollId);
    setErrorMsg((prev) => ({ ...prev, [pollId]: '' }));
    setSuccessMsg((prev) => ({ ...prev, [pollId]: '' }));

    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          pollId,
          unitNumber: unitNumber.trim(),
          optionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg((prev) => ({ ...prev, [pollId]: data.error || 'Алдаа гарлаа' }));
      } else {
        setSuccessMsg((prev) => ({
          ...prev,
          [pollId]: `${unitNumber}-р тоотын санал амжилттай бүртгэгдлээ!`,
        }));
        fetchPolls();
      }
    } catch (err) {
      setErrorMsg((prev) => ({ ...prev, [pollId]: 'Холболтын алдаа гарлаа' }));
    } finally {
      setVotingPollId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold uppercase tracking-wider">
          <Vote className="w-3.5 h-3.5" />
          Оршин суугчдын цахим санал хураалт
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Цахим санал асуулга & Хурал
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Marta Green Lake хотхоны тохижилт, аюулгүй байдал, төсөв зарцуулалтын шийдвэрт өөрийн тоотоороо саналаа өгч оролцоорой.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Ачаалж байна...</div>
      ) : polls.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Vote className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">Одоогоор идэвхтэй санал асуулга алга</h3>
          <p className="text-xs text-slate-400">Шинэ санал асуулга зарлагдах үед энд харагдана.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {polls.map((poll) => {
            const hasVoted = unitInputs[poll.id] && poll.votedUnits[unitInputs[poll.id]?.trim()];
            return (
              <div
                key={poll.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
              >
                {/* Poll Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        poll.status === 'Идэвхтэй'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {poll.status}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Дуусах: {poll.endDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>Нийт санал: <strong>{poll.totalVotes}</strong></span>
                  </div>
                </div>

                {/* Poll Details */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{poll.title}</h2>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed whitespace-pre-line">
                    {poll.description}
                  </p>
                </div>

                {/* Options List & Progress Bars */}
                <div className="space-y-3">
                  {poll.options.map((opt) => {
                    const percent =
                      poll.totalVotes > 0
                        ? Math.round((opt.votes / poll.totalVotes) * 100)
                        : 0;
                    const isSelected = selectedOptions[poll.id] === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          if (poll.status === 'Идэвхтэй') {
                            setSelectedOptions((prev) => ({ ...prev, [poll.id]: opt.id }));
                          }
                        }}
                        className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/50 shadow-sm ring-1 ring-sky-400'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {/* Background vote progress bar */}
                        <div
                          className="absolute inset-y-0 left-0 bg-sky-100/60 rounded-2xl transition-all duration-500 pointer-events-none"
                          style={{ width: `${percent}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-sky-600 bg-sky-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-sm font-semibold text-slate-800">
                              {opt.text}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-slate-900">{percent}%</span>
                            <span className="text-xs text-slate-400 block">({opt.votes} санал)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vote Action Box */}
                {poll.status === 'Идэвхтэй' && (
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        placeholder="Таны тоот (Жишээ: 12)"
                        value={unitInputs[poll.id] || ''}
                        onChange={(e) =>
                          setUnitInputs((prev) => ({ ...prev, [poll.id]: e.target.value }))
                        }
                        className="w-full sm:w-56 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-sky-500"
                      />
                      <button
                        onClick={() => handleVote(poll.id)}
                        disabled={votingPollId === poll.id}
                        className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Vote className="w-3.5 h-3.5" />
                        <span>{votingPollId === poll.id ? 'Бүртгэж байна...' : 'Санал өгөх'}</span>
                      </button>
                    </div>

                    {errorMsg[poll.id] && (
                      <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errorMsg[poll.id]}
                      </p>
                    )}

                    {successMsg[poll.id] && (
                      <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {successMsg[poll.id]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
