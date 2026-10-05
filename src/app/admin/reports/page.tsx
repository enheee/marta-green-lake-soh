'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Receipt,
  UploadCloud,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Building,
} from 'lucide-react';
import { BillRecord, ExpenseReceipt, FinancialReport } from '@/lib/types';

export default function AdminReportsPage() {
  const [bills, setBills] = useState<BillRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseReceipt[]>([]);
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(true);

  // New Expense Modal State
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseReceipt['category']>('Сэлбэг хэрэгсэл');
  const [expAmount, setExpAmount] = useState('');
  const [expStore, setExpStore] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
  const [expPhoto, setExpPhoto] = useState('');
  const [savingExpense, setSavingExpense] = useState(false);

  // Auto Generate Report Modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bRes, eRes, rRes] = await Promise.all([
        fetch('/api/bills').then((r) => r.json()),
        fetch('/api/expenses').then((r) => r.json()),
        fetch('/api/reports').then((r) => r.json()),
      ]);
      setBills(bRes || []);
      setExpenses(eRes || []);
      setReports(rRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Financial Calculations
  const totalUnits = bills.length;
  const paidBills = bills.filter((b) => b.status === 'Төлсөн');
  const unpaidBills = bills.filter((b) => b.status !== 'Төлсөн');
  const collectionRate = totalUnits > 0 ? Math.round((paidBills.length / totalUnits) * 100) : 0;

  // Real collections (sum of paid amounts)
  const totalIncome = paidBills.reduce((acc, b) => acc + b.amount, 0);
  
  // Outstanding receivables
  const totalReceivables = unpaidBills.reduce((acc, b) => acc + b.totalDue, 0);
  
  // Total expenses
  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Net Balance
  const netBalance = totalIncome - totalExpense;

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExpPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;

    setSavingExpense(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: expTitle,
          category: expCategory,
          amount: Number(expAmount),
          storeName: expStore || 'Зах/Дэлгүүр',
          date: expDate,
          photoUrl: expPhoto || undefined,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setExpenses([created, ...expenses]);
        setShowAddExpense(false);
        setExpTitle('');
        setExpAmount('');
        setExpStore('');
        setExpPhoto('');
        showToast('Зарлагын чек амжилттай бүртгэгдлээ!');
      } else {
        showToast('Зарлага хадгалахад алдаа гарлаа', 'error');
      }
    } catch (err) {
      showToast('Холболтын алдаа гарлаа', 'error');
    } finally {
      setSavingExpense(false);
    }
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Delete Expense
  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Энэ зарлагын баримтыг устгах уу?')) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExpenses(expenses.filter((e) => e.id !== id));
        showToast('Зарлагын баримт амжилттай устгагдлаа!');
      } else {
        showToast('Устгахад алдаа гарлаа', 'error');
      }
    } catch (err) {
      showToast('Устгахад алдаа гарлаа', 'error');
    }
  };

  // Publish Monthly Summary
  const handlePublishReport = async () => {
    setPublishing(true);
    const now = new Date();
    const currentMonth = `${now.getFullYear()} оны ${now.getMonth() + 1}-р сар`;
    
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${currentMonth} СӨХ-ийн санхүүгийн нэгдсэн тайлан`,
          period: currentMonth,
          income: totalIncome,
          expense: totalExpense,
          balance: netBalance,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setReports([created, ...reports]);
        setShowPublishModal(false);
        showToast('Тайлан амжилттай нэгтгэгдэж оршин суугчдын порталд нийтлэгдлээ!');
      } else {
        showToast('Нийтлэхэд алдаа гарлаа', 'error');
      }
    } catch (err) {
      showToast('Нийтлэхэд алдаа гарлаа', 'error');
    } finally {
      setPublishing(false);
    }
  };

  // Export Excel CSV
  const handleExportCSV = () => {
    const headers = ['Төрөл', 'Нэр/Тоот', 'Огноо/Сар', 'Ангилал', 'Орлого (₮)', 'Зарлага (₮)', 'Тайлбар'];
    const rows: (string | number)[][] = [];

    // Income rows
    bills.forEach((b) => {
      rows.push([
        'Орлого (Хураамж)',
        `${b.unitNumber}-р тоот`,
        b.paidDate || b.month,
        'СӨХ-ийн хураамж',
        b.status === 'Төлсөн' ? b.amount : 0,
        0,
        b.status === 'Төлсөн' ? 'Төлөгдсөн' : `Төлөөгүй өр: ${b.totalDue}₮`,
      ]);
    });

    // Expense rows
    expenses.forEach((e) => {
      rows.push([
        'Зарлага (Зардал)',
        e.title,
        e.date,
        e.category,
        0,
        e.amount,
        `Дэлгүүр: ${e.storeName}`,
      ]);
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SOH_Sanhuugiin_Tailan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-sm">Санхүүгийн тайланг тооцоолж байна...</div>;
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border backdrop-blur-md ${
              toastType === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Автомат Санхүү & Нягтлангийн систем
          </div>
          <h2 className="text-xl sm:text-2xl font-black">СӨХ-ийн Санхүүгийн Автомат Тайлан</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Нягтлангүйгээр орлого, зарлага, авлага, төлбөрийн гүйцэтгэлийг 100% автоматаар тооцоолж нэгтгэнэ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddExpense(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Зарлага / Чек бүртгэх
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition border border-slate-700"
          >
            <Download className="w-4 h-4 text-sky-400" />
            Excel (CSV) татах
          </button>
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            Оршин суугчдад нийтлэх
          </button>
        </div>
      </div>

      {/* 4 KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Нийт Цугларсан Орлого</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalIncome.toLocaleString()} ₮
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {paidBills.length} айл төлбөрөө төлсөн ({collectionRate}%)
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Нийт Зарцуулсан Зарлага</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {totalExpense.toLocaleString()} ₮
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {expenses.length} баримтаар баталгаажсан
          </div>
        </div>

        {/* Net Cash Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Бодит Үлдэгдэл (Данс/Касс)</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${netBalance >= 0 ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'}`}>
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${netBalance >= 0 ? 'text-sky-600' : 'text-rose-600'}`}>
            {netBalance.toLocaleString()} ₮
          </div>
          <div className="text-xs text-slate-500">
            {netBalance >= 0 ? 'Санхүү эерэг үлдэгдэлтэй' : 'Зарлага орлогоос давсан'}
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Нийт Авлага (Төлөөгүй өр)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {totalReceivables.toLocaleString()} ₮
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {unpaidBills.length} айлын төлбөр дутуу
          </div>
        </div>
      </div>

      {/* Progress & Collection Rate Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Building className="w-4 h-4 text-sky-600" />
            СӨХ-ийн хураамж цугларалтын явц:
          </span>
          <span className="text-sky-600 font-black text-sm">{collectionRate}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${collectionRate}%` }}
          />
          <div
            className="bg-rose-400 h-full transition-all duration-500"
            style={{ width: `${100 - collectionRate}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Төлсөн: {paidBills.length} айл ({totalIncome.toLocaleString()} ₮)
          </span>
          <span className="flex items-center gap-1 font-semibold text-rose-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            Төлөөгүй: {unpaidBills.length} айл ({totalReceivables.toLocaleString()} ₮)
          </span>
        </div>
      </div>

      {/* Two columns: Left: Expenses Table, Right: Published Reports History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-rose-500" />
                СӨХ-ийн Зарлагын Чекийн Бүртгэл
              </h3>
              <p className="text-xs text-slate-500">Сэлбэг, үйлчилгээ, цэвэрлэгээний бодит баримтууд</p>
            </div>
            <button
              onClick={() => setShowAddExpense(true)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Нэмэх
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Зардлын утга</th>
                  <th className="py-3 px-4">Ангилал</th>
                  <th className="py-3 px-4">Дэлгүүр / Зах</th>
                  <th className="py-3 px-4">Огноо</th>
                  <th className="py-3 px-4 font-mono text-right">Дүн</th>
                  <th className="py-3 px-4 text-center">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Бүртгэгдсэн зарлага байхгүй байна. "Зарлага / Чек бүртгэх" товчоор нэмнэ үү.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {exp.title}
                        {exp.photoUrl && (
                          <span className="block text-[10px] text-emerald-600 font-normal">
                            📷 Чек хавсаргасан
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{exp.storeName}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{exp.date}</td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600 text-right">
                        -{exp.amount.toLocaleString()} ₮
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Устгах"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Published Reports Feed (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-sky-600" />
              Нийтлэгдсэн Тайлангууд
            </h3>
            <p className="text-xs text-slate-500">Оршин суугчдад харагдаж буй сар тутмын тайлан</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {reports.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                Одоогоор нийтлэгдсэн тайлан байхгүй байна.
              </div>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{rep.period}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rep.publishedAt}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Орлого</span>
                      <span className="text-[11px] font-bold text-emerald-600 font-mono">
                        +{rep.income.toLocaleString()}₮
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Зарлага</span>
                      <span className="text-[11px] font-bold text-rose-600 font-mono">
                        -{rep.expense.toLocaleString()}₮
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Үлдэгдэл</span>
                      <span className="text-[11px] font-bold text-slate-900 font-mono">
                        {rep.balance.toLocaleString()}₮
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setShowPublishModal(true)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
            Энэ сарын тайланг нийтлэх
          </button>
        </div>
      </div>

      {/* MODAL 1: Add Expense */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-rose-500" />
                СӨХ-ийн Зарлагын Чек / Баримт Бүртгэх
              </h3>
              <button
                onClick={() => setShowAddExpense(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Зардлын утга / Барааны нэр
                </label>
                <input
                  type="text"
                  required
                  placeholder="Жишээ: 1-р орцны паарны хаалт 4ш, жийргэвч"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Ангилал
                  </label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  >
                    <option value="Сэлбэг хэрэгсэл">Сэлбэг хэрэгсэл</option>
                    <option value="Цэвэрлэгээ үйлчилгээ">Цэвэрлэгээ үйлчилгээ</option>
                    <option value="Цахилгаан, сантехник">Цахилгаан, сантехник</option>
                    <option value="Тохижилт, хашаа">Тохижилт, хашаа</option>
                    <option value="Бусад">Бусад зардал</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Мөнгөн дүн (₮)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Жишээ: 125000"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Авсан газар / Дэлгүүр
                  </label>
                  <input
                    type="text"
                    placeholder="Жишээ: 100 айл сантехник"
                    value={expStore}
                    onChange={(e) => setExpStore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Зарцуулсан Огноо
                  </label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Receipt Photo */}
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  И-баримт / Чекний зураг (Сонголттой)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
                {expPhoto && (
                  <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Зураг амжилттай хавсаргагдлаа
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  disabled={savingExpense}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm"
                >
                  {savingExpense ? 'Хадгалж байна...' : 'Зарлагыг бүртгэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Publish Monthly Summary */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-sky-600" />
              Энэ сарын тайланг нэгтгэн нийтлэх
            </h3>
            <p className="text-xs text-slate-500">
              Одоогийн бодит орлого ({totalIncome.toLocaleString()}₮) болон нийт зарлагыг ({totalExpense.toLocaleString()}₮) тооцоолон оршин суугчдын нээлттэй санхүүгийн цэсэнд байршуулна.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Нийт орлого:</span>
                <span className="font-bold text-emerald-600 font-mono">+{totalIncome.toLocaleString()} ₮</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Нийт зарлага:</span>
                <span className="font-bold text-rose-600 font-mono">-{totalExpense.toLocaleString()} ₮</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-black">
                <span className="text-slate-800">Бодит үлдэгдэл:</span>
                <span className="text-slate-900 font-mono">{netBalance.toLocaleString()} ₮</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Болих
              </button>
              <button
                type="button"
                disabled={publishing}
                onClick={handlePublishReport}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition shadow-sm"
              >
                {publishing ? 'Нийтэлж байна...' : 'Баталгаажуулж нийтлэх'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
