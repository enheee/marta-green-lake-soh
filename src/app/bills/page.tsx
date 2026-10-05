'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CreditCard,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building,
  QrCode,
  ArrowRight,
  ShieldAlert,
  Upload,
  Image as ImageIcon,
  X,
  FileCheck,
  FileText,
  Printer,
  Download,
} from 'lucide-react';
import { BillRecord, SohSettings } from '@/lib/types';

function BillsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUnit = searchParams.get('unit') || '';

  const [unitQuery, setUnitQuery] = useState(initialUnit);
  const [searchedUnit, setSearchedUnit] = useState(initialUnit);
  const [bill, setBill] = useState<BillRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SohSettings | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Upload Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptBank, setReceiptBank] = useState('Хаан Банк');
  const [receiptTxn, setReceiptTxn] = useState('');
  const [receiptAmount, setReceiptAmount] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [submittingReceipt, setSubmittingReceipt] = useState(false);
  const [receiptSuccess, setReceiptSuccess] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchedUnit) {
      fetchBill(searchedUnit);
    }
  }, [searchedUnit]);

  const fetchBill = async (unit: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bills?unit=${encodeURIComponent(unit)}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError(`${unit}-р тоотын төлбөрийн мэдээлэл бүртгэгдээгүй байна.`);
        } else {
          setError('Төлбөрийн мэдээлэл татахад алдаа гарлаа.');
        }
        setBill(null);
      } else {
        const data = await res.json();
        setBill(data);
        setReceiptAmount(String(data.totalDue > 0 ? data.totalDue : data.amount));
      }
    } catch (err) {
      setError('Холболтын алдаа гарлаа. Дахин оролдоно уу.');
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (unitQuery.trim()) {
      setSearchedUnit(unitQuery.trim());
      router.replace(`/bills?unit=${encodeURIComponent(unitQuery.trim())}`);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bill) return;

    setSubmittingReceipt(true);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitNumber: bill.unitNumber,
          amount: Number(receiptAmount) || bill.totalDue,
          bankName: receiptBank,
          transactionNo: receiptTxn || `TXN-${Date.now().toString().slice(-6)}`,
          receiptImage: receiptImage || undefined,
        }),
      });

      if (res.ok) {
        setReceiptSuccess(true);
        setTimeout(() => {
          setShowReceiptModal(false);
          setReceiptSuccess(false);
          setReceiptImage(null);
          setReceiptTxn('');
        }, 2000);
      } else {
        alert('Баримт илгээхэд алдаа гарлаа.');
      }
    } catch (err) {
      alert('Холболтын алдаа.');
    } finally {
      setSubmittingReceipt(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-wider">
          <CreditCard className="w-3.5 h-3.5" />
          СӨХ-ийн төлбөрийн хэсэг
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Төлбөрийн үлдэгдэл шалгах
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Та өөрийн байрны тоотоо оруулан сарын хураамж болон өмнөх үлдэгдлээ шалгаж, төлбөрөө шилжүүлнэ үү.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Тоот оруулна уу (Жишээ: 12)"
              value={unitQuery}
              onChange={(e) => setUnitQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !unitQuery.trim()}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {loading ? 'Шалгаж байна...' : 'Шалгах'}
          </button>
        </form>

        {/* Quick select pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Турших тоот:</span>
          {['5', '12', '24', '35', '48'].map((sampleUnit) => (
            <button
              key={sampleUnit}
              onClick={() => {
                setUnitQuery(sampleUnit);
                setSearchedUnit(sampleUnit);
                router.replace(`/bills?unit=${sampleUnit}`);
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 transition-colors"
            >
              {sampleUnit}-р тоот
            </button>
          ))}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3 max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Bill Results Card */}
      {bill && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Card Header Status */}
            <div
              className={`p-6 sm:p-8 ${
                bill.status === 'Төлсөн'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white'
                  : 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-2">
                    <Building className="w-3.5 h-3.5" />
                    {bill.apartmentNumber}
                  </div>
                  <h2 className="text-3xl font-extrabold">{bill.unitNumber}-р тоот</h2>
                  <p className="text-white/80 text-sm mt-1">{bill.month}</p>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-white/70 block uppercase tracking-wider font-medium">
                    {bill.status === 'Төлсөн' ? 'Төлөгдсөн төлөв' : 'Нийт төлөх дүн'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                    {bill.totalDue === 0 ? '0 ₮' : `${bill.totalDue.toLocaleString()} ₮`}
                  </div>
                  <div className="mt-2">
                    {bill.status === 'Төлсөн' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/30 text-emerald-100 text-xs font-bold border border-emerald-300/40">
                        <CheckCircle2 className="w-4 h-4" /> Төлөгдсөн
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 text-xs font-bold border border-rose-400/40">
                        <AlertCircle className="w-4 h-4" /> Төлөөгүй үлдэгдэлтэй
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Төлбөрийн задгай бүтэц</h3>
                  <p className="text-xs text-slate-500">СӨХ-ийн хураамжийн зардлын зориулалт</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Нэхэмжлэх татах / хэвлэх</span>
                  </button>
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Төлбөрийн баримт илгээх</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block">Энэ сарын хураамж</span>
                  <span className="text-lg font-bold text-slate-900 mt-1 block">
                    {bill.amount.toLocaleString()} ₮
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block">Өмнөх үлдэгдэл</span>
                  <span
                    className={`text-lg font-bold mt-1 block ${
                      bill.previousBalance > 0 ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    {bill.previousBalance.toLocaleString()} ₮
                  </span>
                </div>
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
                  <span className="text-xs text-sky-700 font-semibold block">Нийт төлөх дүн</span>
                  <span className="text-lg font-black text-sky-800 mt-1 block">
                    {bill.totalDue.toLocaleString()} ₮
                  </span>
                </div>
              </div>

              {/* Itemized Service Breakdown */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Сарын төлбөрийн задгай хуваарилалт
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                    <span className="text-slate-400 block text-[11px]">Цэвэрлэгээ, ариутгал</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {(bill.breakdown?.cleaning ?? Math.round(bill.amount * 0.28)).toLocaleString()} ₮
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                    <span className="text-slate-400 block text-[11px]">Харуул хамгаалалт</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {(bill.breakdown?.security ?? Math.round(bill.amount * 0.35)).toLocaleString()} ₮
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                    <span className="text-slate-400 block text-[11px]">Цахилгаан шат (Лифт)</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {(bill.breakdown?.elevator ?? Math.round(bill.amount * 0.16)).toLocaleString()} ₮
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                    <span className="text-slate-400 block text-[11px]">Хог хаягдал зайлуулах</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {(bill.breakdown?.waste ?? Math.round(bill.amount * 0.08)).toLocaleString()} ₮
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                    <span className="text-slate-400 block text-[11px]">Захиргаа & Засвар</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {(bill.breakdown?.management ?? Math.round(bill.amount * 0.13)).toLocaleString()} ₮
                    </span>
                  </div>
                </div>
              </div>

              {bill.paidDate && (
                <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Сүүлд төлөлт хийсэн огноо: <span className="font-bold">{bill.paidDate}</span>
                </p>
              )}
            </div>
          </div>

          {/* Payment Instructions & Bank Accounts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Банкаар шилжүүлэх заавар</h3>
                <p className="text-xs text-slate-500">
                  Гүйлгээний утгаа зөв бичсэнээр таны төлөлт шуурхай баталгаажна.
                </p>
              </div>
            </div>

            {/* Bank details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings?.bankAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded inline-block">
                      {acc.bankName}
                    </span>
                    <div className="text-xl font-mono font-extrabold text-slate-900 pt-1">
                      {acc.accountNumber}
                    </div>
                    <span className="text-xs text-slate-500 block">
                      Хүлээн авагч: <strong className="text-slate-700">{acc.accountName}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(acc.accountNumber, `bank-${idx}`)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    {copiedKey === `bank-${idx}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Хуулбарлагдлаа!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Дансны дугаар хуулах</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Transaction remark */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Гүйлгээний утга:
                </span>
                <p className="text-sm font-bold text-slate-900 font-mono">
                  {bill.unitNumber}-р тоот {bill.month}
                </p>
                <p className="text-xs text-slate-500">
                  Жишээ нь: <span className="font-semibold text-slate-700">{bill.unitNumber}-р тоот СӨХ төлбөр</span>
                </p>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(`${bill.unitNumber}-р тоот ${bill.month}`, 'remark')
                }
                className="self-start sm:self-center px-4 py-2 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedKey === 'remark' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Хуулагдлаа</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Утга хуулах</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Receipt Modal */}
      {showReceiptModal && bill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Төлбөрийн баримт илгээх
                </h3>
                <p className="text-xs text-slate-500">{bill.unitNumber}-р тоотын төлөлт</p>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {receiptSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Баримт амжилттай илгээгдлээ!</h4>
                <p className="text-xs text-slate-500">
                  СӨХ-ийн нягтлан баримтыг шалгаж, төлбөрийг тань шуурхай баталгаажуулна.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReceiptSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Шилжүүлсэн дүн *
                    </label>
                    <input
                      type="number"
                      required
                      value={receiptAmount}
                      onChange={(e) => setReceiptAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Банк
                    </label>
                    <select
                      value={receiptBank}
                      onChange={(e) => setReceiptBank(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-sky-500 focus:outline-none"
                    >
                      <option value="Хаан Банк">Хаан Банк</option>
                      <option value="Голомт Банк">Голомт Банк</option>
                      <option value="ХХБ">ХХБ</option>
                      <option value="Бусад банк">Бусад банк</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Гүйлгээний дугаар / Утга
                  </label>
                  <input
                    type="text"
                    placeholder="Жишээ: TXN-123456"
                    value={receiptTxn}
                    onChange={(e) => setReceiptTxn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                {/* File / Screenshot input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Баримтын зураг (Скриншот)
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-sky-50/50 transition-colors">
                    {receiptImage ? (
                      <div className="space-y-2 text-center">
                        <img
                          src={receiptImage}
                          alt="Receipt Preview"
                          className="max-h-32 rounded-lg mx-auto shadow-sm"
                        />
                        <span className="text-[11px] text-sky-600 font-bold block">
                          Зургийг солих
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                        <span className="text-xs font-bold text-slate-700 block">
                          Зураг сонгох / хавсаргах
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          PNG, JPG баримтын зураг
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                  >
                    Болих
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReceipt}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm"
                  >
                    {submittingReceipt ? 'Илгээж байна...' : 'Баримт илгээх'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Official Invoice Modal */}
      {showInvoiceModal && bill && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 my-8 print:p-0 print:shadow-none print:max-w-none">
            {/* Modal Controls (Hidden when printing) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Албан ёсны цахим нэхэмжлэх
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Хэвлэх / PDF</span>
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Document */}
            <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 print:border-none print:p-0">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    МАРТА ГРИН ЛЭЙК СӨХ
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Регистр: 8493021 | Утас: 7711-2233
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 rounded-lg font-mono text-xs font-bold mb-1">
                    НЭХЭМЖЛЭХ
                  </span>
                  <p className="text-xs text-slate-500 font-mono">
                    № INV-{bill.month.replace(/[^0-9]/g, '')}-{bill.unitNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    Огноо: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    ТӨЛБӨР ТӨЛӨГЧ:
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {bill.apartmentNumber}, {bill.unitNumber}-р тоот
                  </p>
                  <p className="text-slate-500">Оршин суугч</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    ХАМРАХ ХУГАЦАА:
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{bill.month}</p>
                  <p className="text-slate-500">СӨХ-ийн сарын төлбөр</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">№</th>
                      <th className="py-2.5 px-3">Үйлчилгээний нэр</th>
                      <th className="py-2.5 px-3 text-center">Хэмжих нэгж</th>
                      <th className="py-2.5 px-3 text-right">Дүн (₮)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-mono text-slate-400">1</td>
                      <td className="py-2 px-3 font-medium text-slate-800">
                        Орц, нийтийн эзэмшлийн цэвэрлэгээ, ариутгал
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">сар</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {(bill.breakdown?.cleaning ?? Math.round(bill.amount * 0.28)).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-slate-400">2</td>
                      <td className="py-2 px-3 font-medium text-slate-800">
                        Харуул хамгаалалт, аюулгүй байдлын үйлчилгээ
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">сар</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {(bill.breakdown?.security ?? Math.round(bill.amount * 0.35)).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-slate-400">3</td>
                      <td className="py-2 px-3 font-medium text-slate-800">
                        Цахилгаан шат (Лифт)-ийн ашиглалт, үзлэг засвар
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">сар</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {(bill.breakdown?.elevator ?? Math.round(bill.amount * 0.16)).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-slate-400">4</td>
                      <td className="py-2 px-3 font-medium text-slate-800">
                        Ахуйн хог хаягдал ачилт, тээвэрлэлт
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">сар</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {(bill.breakdown?.waste ?? Math.round(bill.amount * 0.08)).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-slate-400">5</td>
                      <td className="py-2 px-3 font-medium text-slate-800">
                        СӨХ-ийн захиргааны зардал, их засварын сан
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">сар</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {(bill.breakdown?.management ?? Math.round(bill.amount * 0.13)).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t-2 border-slate-300 font-bold">
                    <tr>
                      <td colSpan={3} className="py-2 px-3 text-right text-slate-600">
                        Сарын хураамж:
                      </td>
                      <td className="py-2 px-3 text-right font-mono">
                        {bill.amount.toLocaleString()} ₮
                      </td>
                    </tr>
                    {bill.previousBalance > 0 && (
                      <tr>
                        <td colSpan={3} className="py-2 px-3 text-right text-rose-600">
                          Өмнөх үлдэгдэл:
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-rose-600">
                          +{bill.previousBalance.toLocaleString()} ₮
                        </td>
                      </tr>
                    )}
                    <tr className="text-sm bg-slate-50">
                      <td colSpan={3} className="py-3 px-3 text-right text-slate-900 font-black">
                        НИЙТ ТӨЛБӨР:
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-indigo-700">
                        {bill.totalDue.toLocaleString()} ₮
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment instructions footer */}
              <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-800 mb-1">Шилжүүлэх данс:</p>
                  <p className="text-slate-600 font-mono">
                    Хаан банк: <strong className="text-slate-900">5012345678</strong> (Марта Грин Лэйк СӨХ)
                  </p>
                  <p className="text-slate-600 font-mono">
                    Голомт банк: <strong className="text-slate-900">1234567890</strong> (Марта Грин Лэйк СӨХ)
                  </p>
                  <p className="text-amber-800 font-semibold mt-1">
                    Гүйлгээний утга: <span className="font-mono">{bill.unitNumber} тоот</span>
                  </p>
                </div>
                <div className="text-right sm:self-end">
                  <div className="border-t border-dashed border-slate-300 pt-2 w-36 ml-auto">
                    <p className="text-[10px] text-slate-400">Тамга, тэмдэг / Нягтлан</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BillsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Ачаалж байна...</div>}>
      <BillsContent />
    </Suspense>
  );
}
