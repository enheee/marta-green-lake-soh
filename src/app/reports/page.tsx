'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Scale,
  ShieldCheck,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { FinancialReport, SohSettings } from '@/lib/types';

export default function ReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [settings, setSettings] = useState<SohSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch('/api/reports'), fetch('/api/settings')])
      .then(async ([repRes, setRes]) => {
        if (repRes.ok) setReports(await repRes.json());
        if (setRes.ok) setSettings(await setRes.json());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          Ил тод байдал & Тайлан
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Санхүүгийн тайлан & Байрны журам
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          СӨХ-ийн цугларсан хураамжийн зарцуулалт, сарын орлого зарлагын нээлттэй тайлан болон дагаж мөрдөх дүрэм журмууд.
        </p>
      </div>

      {/* Financial Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-600" />
            Сар бүрийн санхүүгийн товчоо
          </h2>
          <span className="text-xs text-slate-400 font-medium">Шинэчлэгдсэн: 2026 оны 9-р сар</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                  {rep.period}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {rep.publishedAt}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">{rep.title}</h3>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Нийт орлого:
                  </span>
                  <span className="font-bold text-slate-900">
                    +{rep.income.toLocaleString()} ₮
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Нийт зарлага:
                  </span>
                  <span className="font-bold text-slate-900">
                    -{rep.expense.toLocaleString()} ₮
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800">Үлдэгдэл сан:</span>
                  <span className="font-black text-sm text-sky-600">
                    {rep.balance.toLocaleString()} ₮
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Building Rules and Policies */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Оршин суугчдын дагаж мөрдөх нийтлэг дүрэм журам
            </h2>
            <p className="text-xs text-slate-500">
              Нийтийн эзэмшлийн эд хөрөнгийг хайрлан хамгаалах, хөршийн амар тайван байдлыг хангах журам
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {settings?.rules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
