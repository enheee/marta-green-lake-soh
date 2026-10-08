'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Download,
  Filter,
  RefreshCw,
  X,
  Check,
  FileSpreadsheet,
  UploadCloud,
  FileCheck2,
  Eye,
  CheckCheck,
  Building,
  LayoutGrid,
} from 'lucide-react';
import { BillRecord, PaymentReceipt } from '@/lib/types';

export default function AdminBillsPage() {
  const [activeTab, setActiveTab] = useState<'bills' | 'matrix' | 'receipts'>('matrix');
  const [bills, setBills] = useState<BillRecord[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Бүгд' | 'Төлсөн' | 'Төлөөгүй'>('Бүгд');

  // Edit Modal state
  const [editingBill, setEditingBill] = useState<BillRecord | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editPrevBalance, setEditPrevBalance] = useState('');
  const [saving, setSaving] = useState(false);

  // Bank Statement Reconciliation Modal
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [statementText, setStatementText] = useState('');
  const [matchedResults, setMatchedResults] = useState<
    { unitNumber: string; amount: number; rawText: string; bill?: BillRecord }[]
  >([]);
  const [reconciling, setReconciling] = useState(false);

  // Receipt image preview modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchBills = async () => {
    try {
      const res = await fetch('/api/bills', { cache: 'no-store' });
      if (res.ok) setBills(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReceipts = async () => {
    try {
      const res = await fetch('/api/receipts');
      if (res.ok) setReceipts(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchBills(), fetchReceipts()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleToggleStatus = async (bill: BillRecord) => {
    const newStatus = bill.status === 'Төлсөн' ? 'Төлөөгүй' : 'Төлсөн';
    const newTotalDue = newStatus === 'Төлсөн' ? 0 : bill.amount + bill.previousBalance;
    const now = new Date().toISOString().slice(0, 10);

    try {
      const res = await fetch('/api/bills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bill.id,
          status: newStatus,
          totalDue: newTotalDue,
          paidDate: newStatus === 'Төлсөн' ? now : undefined,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBills((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      }
    } catch (err) {
      alert('Шинэчлэхэд алдаа гарлаа');
    }
  };

  const handleApproveReceipt = async (receiptId: string) => {
    try {
      const res = await fetch('/api/receipts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptId, action: 'approve' }),
      });

      if (res.ok) {
        const data = await res.json();
        setReceipts((prev) =>
          prev.map((r) => (r.id === receiptId ? { ...r, status: 'Баталгаажсан' } : r))
        );
        if (data.bill) {
          setBills((prev) => prev.map((b) => (b.id === data.bill.id ? data.bill : b)));
        }
      }
    } catch (err) {
      alert('Баталгаажуулахад алдаа гарлаа');
    }
  };

  const handleRejectReceipt = async (receiptId: string) => {
    if (!confirm('Энэ баримтаас татгалзах уу?')) return;
    try {
      const res = await fetch('/api/receipts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptId, action: 'reject' }),
      });

      if (res.ok) {
        setReceipts((prev) =>
          prev.map((r) => (r.id === receiptId ? { ...r, status: 'Татгалзсан' } : r))
        );
      }
    } catch (err) {
      alert('Алдаа гарлаа');
    }
  };

  // Reconcile logic: parse bank statement text
  const parseStatement = (text: string) => {
    const lines = text.split('\n');
    const matched: typeof matchedResults = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Extract unit number: e.g. "12-р тоот", "12 тоот", "тоот 12", "12р", "Marta 12"
      const unitMatch =
        trimmed.match(/(\d{1,3})\s*(?:-р|-ийн)?\s*тоот/i) ||
        trimmed.match(/(?:тоот\s*)(\d{1,3})/i) ||
        trimmed.match(/\b(\d{1,3})\s*toot\b/i);

      // Extract amount: e.g. "28,000" or "28000" or "35000"
      const amountMatch = trimmed.match(/(\d{1,3}(?:,\d{3})*|\d{4,6})(?:\s*₮|\s*MNT|\s*tug)?/);

      if (unitMatch) {
        const unitNumber = unitMatch[1];
        let amount = 0;
        if (amountMatch) {
          amount = Number(amountMatch[1].replace(/,/g, ''));
        }

        const bill = bills.find((b) => b.unitNumber === unitNumber);
        matched.push({
          unitNumber,
          amount,
          rawText: trimmed,
          bill,
        });
      }
    });

    setMatchedResults(matched);
  };

  const handleConfirmReconciliation = async () => {
    if (matchedResults.length === 0) return;
    setReconciling(true);

    const updatedBills = [...bills];
    const now = new Date().toISOString().slice(0, 10);

    matchedResults.forEach((m) => {
      const idx = updatedBills.findIndex((b) => b.unitNumber === m.unitNumber);
      if (idx !== -1) {
        updatedBills[idx] = {
          ...updatedBills[idx],
          status: 'Төлсөн',
          totalDue: 0,
          paidDate: now,
        };
      }
    });

    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBills),
      });

      if (res.ok) {
        setBills(updatedBills);
        setShowReconcileModal(false);
        setStatementText('');
        setMatchedResults([]);
        alert(`Амжилттай! ${matchedResults.length} айлын төлбөр тулгагдан баталгаажлаа.`);
      }
    } catch (err) {
      alert('Тулгалт хадгалахад алдаа гарлаа');
    } finally {
      setReconciling(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Байр', 'Тоот', 'Сар', 'Сарын хураамж', 'Өмнөх үлдэгдэл', 'Нийт төлөх', 'Төлөв'];
    const rows = bills.map((b) => [
      b.apartmentNumber,
      b.unitNumber,
      b.month,
      b.amount,
      b.previousBalance,
      b.totalDue,
      b.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `marta_bills_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingReceiptsCount = receipts.filter((r) => r.status === 'Хүлээгдэж буй').length;

  const filteredBills = bills.filter((b) => {
    const matchesSearch = b.unitNumber.includes(searchQuery.trim());
    const matchesStatus =
      statusFilter === 'Бүгд'
        ? true
        : statusFilter === 'Төлсөн'
        ? b.status === 'Төлсөн'
        : b.status !== 'Төлсөн';
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Төлбөр & Баримтын нэгдсэн систем</h2>
          <p className="text-xs text-slate-500">
            Нийт {bills.length} тоот бүртгэлтэй байна. Төлөлт засах, банкны хуулга уншуулах, ирсэн баримт шалгах.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowReconcileModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Банкны хуулга уншуулах</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Excel татах</span>
          </button>
          <button
            onClick={loadAll}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs shadow-sm transition-colors"
            title="Шинэчлэх"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'matrix'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Давхар, сарын нэгдсэн самбар (Цаасан тайлангийн дижитал хувилбар)</span>
        </button>
        <button
          onClick={() => setActiveTab('bills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bills'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Жагсаалтаар харах ({bills.length})
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'receipts'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Ирсэн төлбөрийн баримтууд ({receipts.length})</span>
          {pendingReceiptsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
              {pendingReceiptsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Bills Table */}
      {activeTab === 'bills' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Тоотоор хайх (Жишээ: 12)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {(['Бүгд', 'Төлсөн', 'Төлөөгүй'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Тоот</th>
                    <th className="py-3.5 px-4">Сарын хураамж</th>
                    <th className="py-3.5 px-4">Өмнөх үлдэгдэл</th>
                    <th className="py-3.5 px-4">Нийт төлөх</th>
                    <th className="py-3.5 px-4">Төлөв</th>
                    <th className="py-3.5 px-4 text-right">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredBills.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                        {b.unitNumber}-р тоот
                      </td>
                      <td className="py-3 px-4 font-mono">{b.amount.toLocaleString()} ₮</td>
                      <td className="py-3 px-4 font-mono">
                        <span className={b.previousBalance > 0 ? 'text-rose-600 font-bold' : ''}>
                          {b.previousBalance.toLocaleString()} ₮
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {b.totalDue.toLocaleString()} ₮
                      </td>
                      <td className="py-3 px-4">
                        {b.status === 'Төлсөн' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3" /> Төлсөн
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                            <AlertCircle className="w-3 h-3" /> Төлөөгүй
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(b)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            b.status === 'Төлсөн'
                              ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {b.status === 'Төлсөн' ? 'Буцаах' : 'Төлсөн болгох'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingBill(b);
                            setEditAmount(String(b.amount));
                            setEditPrevBalance(String(b.previousBalance));
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                          title="Засах"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Digital Floor Matrix Board (Paper Report Digitized) */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Summary Box */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold mb-1 border border-emerald-500/30">
                <LayoutGrid className="w-3.5 h-3.5" />
                МАРТА-8 СӨХ (102-р байр) Төлбөрийн нэгдсэн самбар
              </div>
              <h3 className="text-base font-black">Давхар, сар бүрийн төлөлтийн дижитал архив</h3>
              <p className="text-xs text-slate-300">
                Орцонд цаасаар наадаг байсан тайланг 100% дижитал болгосон шууд төлөв засах боломжтой самбар.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700/80">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Нийт айлын тоо</span>
                <span className="text-lg font-black text-white">{bills.length} тоот</span>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Нийт авлага (Өр)</span>
                <span className="text-lg font-black text-rose-400 font-mono">
                  {bills.reduce((acc, b) => acc + b.totalDue, 0).toLocaleString()} ₮
                </span>
              </div>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                  Төлөгдсөн
                </span>
                <span className="flex items-center gap-1.5 font-bold text-rose-700">
                  <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
                  Төлөөгүй (40,000₮)
                </span>
                <span className="text-slate-400">| Сарын суурь хураамж: <strong>40,000 ₮</strong></span>
              </div>

              <span className="text-[11px] text-slate-500">
                💡 Нүдэн дээр дарж тухайн сарын төлөлтийн төлөвийг шууд сольж болно
              </span>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white font-bold text-[11px] sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="py-2.5 px-3 border border-slate-800 w-16 text-center">Давхар</th>
                    <th className="py-2.5 px-3 border border-slate-800 w-16 text-center">Тоот</th>
                    {['2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар'].map((m) => (
                      <th key={m} className="py-2.5 px-2 border border-slate-800 text-center font-mono">
                        {m}
                      </th>
                    ))}
                    <th className="py-2.5 px-3 border border-slate-800 text-right font-mono">Төлбөрийн үлдэгдэл</th>
                    <th className="py-2.5 px-3 border border-slate-800 text-center">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {bills.map((b) => {
                    const months = ['2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар'];
                    return (
                      <tr key={b.id} className="hover:bg-sky-50/50 transition-colors">
                        <td className="py-2 px-3 border border-slate-200 text-center font-bold text-slate-500 bg-slate-50/50">
                          {b.floor || Math.min(16, Math.floor((Number(b.unitNumber) - 1) / 8) + 2)} давхар
                        </td>
                        <td className="py-2 px-3 border border-slate-200 text-center font-black text-slate-900 bg-slate-50/80">
                          {b.unitNumber}-р тоот
                        </td>
                        {months.map((m) => {
                          const monthData = b.monthHistory?.[m];
                          const isPaid = monthData ? monthData.status === 'Төлсөн' : b.status === 'Төлсөн';
                          return (
                            <td
                              key={m}
                              onClick={() => {
                                // Toggle this month status
                                const updatedBills = bills.map((billItem) => {
                                  if (billItem.id !== b.id) return billItem;
                                  const currentHistory = { ...(billItem.monthHistory || {}) };
                                  const newStatus = isPaid ? 'Төлөөгүй' : 'Төлсөн';
                                  currentHistory[m] = { status: newStatus, amount: 40000 };
                                  
                                  // Recalculate totalDue
                                  const unpaidCount = months.filter(
                                    (monthKey) => currentHistory[monthKey]?.status === 'Төлөөгүй'
                                  ).length;
                                  const newTotalDue = unpaidCount * 40000;
                                  const newStatusType: 'Төлсөн' | 'Төлөөгүй' = newTotalDue === 0 ? 'Төлсөн' : 'Төлөөгүй';

                                  return {
                                    ...billItem,
                                    monthHistory: currentHistory,
                                    totalDue: newTotalDue,
                                    status: newStatusType,
                                  };
                                });
                                setBills(updatedBills);
                              }}
                              className={`py-2 px-2 border border-slate-200 text-center font-mono cursor-pointer transition select-none ${
                                isPaid
                                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold'
                                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold'
                              }`}
                              title={`${m}: Төлвийг солихын тулд дарна уу`}
                            >
                              {isPaid ? (
                                <span className="inline-block text-[10px] text-emerald-700">✓ Төлсөн</span>
                              ) : (
                                <span className="inline-block text-[10px] text-rose-700">40,000₮</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-2 px-3 border border-slate-200 text-right font-mono font-black text-sm">
                          {b.totalDue === 0 ? (
                            <span className="text-emerald-600">0 ₮</span>
                          ) : (
                            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                              {b.totalDue.toLocaleString()} ₮
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 border border-slate-200 text-center">
                          <button
                            onClick={() => handleToggleStatus(b)}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                              b.status === 'Төлсөн'
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {b.status === 'Төлсөн' ? 'Өртэй болгох' : 'Бүгдийг төлсөн'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Receipts Queue */}
      {activeTab === 'receipts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Тоот</th>
                    <th className="py-3.5 px-4">Дүн</th>
                    <th className="py-3.5 px-4">Банк & Гүйлгээний №</th>
                    <th className="py-3.5 px-4">Баримтын зураг</th>
                    <th className="py-3.5 px-4">Илгээсэн огноо</th>
                    <th className="py-3.5 px-4">Төлөв</th>
                    <th className="py-3.5 px-4 text-right">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {receipts.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                        {rec.unitNumber}-р тоот
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {rec.amount.toLocaleString()} ₮
                      </td>
                      <td className="py-3 px-4 space-y-0.5">
                        <span className="font-semibold text-slate-700 block">{rec.bankName}</span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          {rec.transactionNo}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {rec.receiptImage ? (
                          <button
                            onClick={() => setPreviewImage(rec.receiptImage || null)}
                            className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-bold bg-sky-50 px-2 py-1 rounded-lg border border-sky-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Харах</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Зураггүй</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{rec.createdAt}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            rec.status === 'Баталгаажсан'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : rec.status === 'Татгалзсан'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {rec.status === 'Хүлээгдэж буй' && (
                          <>
                            <button
                              onClick={() => handleApproveReceipt(rec.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                            >
                              Баталгаажуулах
                            </button>
                            <button
                              onClick={() => handleRejectReceipt(rec.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 transition-colors"
                            >
                              Татгалзах
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">Төлбөрийн баримтын эх хувь</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[75vh] flex justify-center bg-slate-50 rounded-2xl p-2">
              <img src={previewImage} alt="Receipt Full" className="rounded-xl max-w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Bank Statement Reconciliation Modal */}
      {showReconcileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Банкны хуулгаар автомат тулгалт хийх
                  </h3>
                  <p className="text-xs text-slate-500">
                    Хаан банк, Голомт банкны хуулгын текстийг хуулж тавихад тоотууд автоматаар танигдана.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReconcileModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Банкны хуулгын мөрүүд:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const sample = `2026-09-15 | 28,000 | 12-р тоот Marta Green Lake СӨХ
2026-09-15 | 35,000 | Нарлаг өргөө 24 тоот төлбөр
2026-09-14 | 22,000 | 5-р тоот сарын хураамж
2026-09-14 | 28,000 | Marta 35 тоот`;
                    setStatementText(sample);
                    parseStatement(sample);
                  }}
                  className="text-xs font-bold text-sky-600 hover:underline"
                >
                  Жишээ хуулга оруулах
                </button>
              </div>

              <textarea
                rows={5}
                placeholder="Банкны хуулгаа энд paste хийнэ үү... (Жишээ: 28,000 12-р тоот)"
                value={statementText}
                onChange={(e) => {
                  setStatementText(e.target.value);
                  parseStatement(e.target.value);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:bg-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Matched Preview */}
            {matchedResults.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Таарсан үр дүн: <strong>{matchedResults.length}</strong> айл
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    Нийт: {matchedResults.reduce((a, b) => a + b.amount, 0).toLocaleString()} ₮
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100">
                  {matchedResults.map((m, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          {m.unitNumber}-р тоот
                        </span>
                        <span className="text-slate-400 text-[11px] ml-2 line-clamp-1 inline-block">
                          ({m.rawText})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono text-emerald-600 block">
                          +{m.amount.toLocaleString()} ₮
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {m.bill?.status === 'Төлсөн' ? 'Аль хэдийн төлсөн' : 'Төлөгдөнө'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setShowReconcileModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Хаах
              </button>
              <button
                type="button"
                disabled={reconciling || matchedResults.length === 0}
                onClick={handleConfirmReconciliation}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCheck className="w-4 h-4" />
                <span>
                  {reconciling
                    ? 'Тулгаж байна...'
                    : `Бүх (${matchedResults.length}) төлбөрийг баталгаажуулах`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {editingBill.unitNumber}-р тоотын төлбөр засах
              </h3>
              <button
                onClick={() => setEditingBill(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                const amount = Number(editAmount) || 0;
                const previousBalance = Number(editPrevBalance) || 0;
                const isPaid = editingBill.status === 'Төлсөн';
                const totalDue = isPaid ? 0 : amount + previousBalance;

                try {
                  const res = await fetch('/api/bills', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: editingBill.id,
                      amount,
                      previousBalance,
                      totalDue,
                    }),
                  });

                  if (res.ok) {
                    const updated = await res.json();
                    setBills((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
                    setEditingBill(null);
                  }
                } catch (err) {
                  alert('Хадгалахад алдаа гарлаа');
                } finally {
                  setSaving(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Сарын хураамж (₮)
                </label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Өмнөх үлдэгдэл авлага (₮)
                </label>
                <input
                  type="number"
                  value={editPrevBalance}
                  onChange={(e) => setEditPrevBalance(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBill(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm"
                >
                  {saving ? 'Хадгалж байна...' : 'Хадгалах'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
