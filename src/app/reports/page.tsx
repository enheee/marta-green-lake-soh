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
  Receipt,
  Search,
  Filter,
  Eye,
  X,
  ExternalLink,
  Shield,
  Layers,
  Store,
} from 'lucide-react';
import { FinancialReport, SohSettings, ExpenseReceipt } from '@/lib/types';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'expenses' | 'reports' | 'rules'>('expenses');
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [expenses, setExpenses] = useState<ExpenseReceipt[]>([]);
  const [settings, setSettings] = useState<SohSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Expense filters & preview
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('all');
  const [previewReceipt, setPreviewReceipt] = useState<ExpenseReceipt | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/reports'),
      fetch('/api/settings'),
      fetch('/api/expenses'),
    ])
      .then(async ([repRes, setRes, expRes]) => {
        if (repRes.ok) setReports(await repRes.json());
        if (setRes.ok) setSettings(await setRes.json());
        if (expRes.ok) setExpenses(await expRes.json());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(expenseSearch.toLowerCase()) ||
      e.storeName.toLowerCase().includes(expenseSearch.toLowerCase());
    const matchesCategory =
      expenseCategory === 'all' ? true : e.category === expenseCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          Шилэн СӨХ & Ил тод байдал
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Санхүүгийн ил тод архив & Дүрэм журам
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          СӨХ-ийн төсөв хэрхэн зарцуулагдаж буйг баримт чектэй нь нээлттэй харах боломжтой баталгаат цахим архив.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'expenses'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Зарлагын чекийн архив ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'reports'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            Сарын санхүүгийн товчоо
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'rules'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Байрны дүрэм журам
          </button>
        </div>
      </div>

      {/* Tab 1: Expense Receipts (Transparency Vault) */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold block mb-1">
                Шилэн зарцуулалт
              </span>
              <h2 className="text-2xl font-black">Нийт баталгаажсан зардлын баримтууд</h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-lg">
                Оршин суугч бүр сар бүр төлсөн хураамж юунд зарцуулагдсаныг чекийн зураг, дэлгүүрийн баримттай нь үзэх эрхтэй.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
              <span className="text-xs text-emerald-200 block uppercase font-bold">Бүртгэгдсэн зарлага</span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {totalExpenseAmount.toLocaleString()} ₮
              </span>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Зардал, дэлгүүр, бараа хайх..."
                value={expenseSearch}
                onChange={(e) => setExpenseSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-semibold">Ангилал:</span>
              {[
                { id: 'all', label: 'Бүгд' },
                { id: 'Цахилгаан, сантехник', label: 'Сантехник, цахилгаан' },
                { id: 'Цэвэрлэгээ үйлчилгээ', label: 'Цэвэрлэгээ' },
                { id: 'Сэлбэг хэрэгсэл', label: 'Сэлбэг' },
                { id: 'Тохижилт, хашаа', label: 'Тохижилт' },
                { id: 'Бусад', label: 'Бусад' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setExpenseCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    expenseCategory === cat.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Receipts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExpenses.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                Зарлагын баримт олдсонгүй.
              </div>
            ) : (
              filteredExpenses.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setPreviewReceipt(exp)}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={exp.photoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60'}
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="font-bold px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
                          {exp.date}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] bg-emerald-500/80 px-2 py-0.5 rounded-md font-semibold">
                          <Eye className="w-3 h-3" /> Баримт харах
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {exp.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{exp.id}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        <span>Худалдан авсан: <strong className="text-slate-700">{exp.storeName}</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-400 font-semibold">Зарцуулсан дүн:</span>
                    <span className="text-lg font-black text-rose-600 font-mono">
                      -{exp.amount.toLocaleString()} ₮
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Financial Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-sky-600" />
              Сар бүрийн санхүүгийн нэгтгэл
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
      )}

      {/* Tab 3: Building Rules and Policies */}
      {activeTab === 'rules' && (
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
      )}

      {/* Receipt Preview Modal */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setPreviewReceipt(null)}
              className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {previewReceipt.category}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">{previewReceipt.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Дэлгүүр / Гүйцэтгэгч: {previewReceipt.storeName} | Огноо: {previewReceipt.date}
              </p>
            </div>

            <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center max-h-[50vh]">
              <img
                src={previewReceipt.photoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60'}
                alt={previewReceipt.title}
                className="w-full h-auto max-h-[50vh] object-contain"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-500 block">Баталгаажсан дүн</span>
                <span className="text-2xl font-black text-rose-600 font-mono">
                  -{previewReceipt.amount.toLocaleString()} ₮
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
