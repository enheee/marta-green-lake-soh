'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Bell,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { BillRecord, ComplaintRequest, Announcement } from '@/lib/types';

export default function AdminDashboardPage() {
  const [bills, setBills] = useState<BillRecord[]>([]);
  const [requests, setRequests] = useState<ComplaintRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/bills').then((r) => r.json()),
      fetch('/api/requests').then((r) => r.json()),
      fetch('/api/announcements').then((r) => r.json()),
    ])
      .then(([bData, rData, aData]) => {
        setBills(bData);
        setRequests(rData);
        setAnnouncements(aData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalUnits = bills.length;
  const paidBills = bills.filter((b) => b.status === 'Төлсөн');
  const unpaidBills = bills.filter((b) => b.status !== 'Төлсөн');
  const paidPercent = totalUnits > 0 ? Math.round((paidBills.length / totalUnits) * 100) : 0;

  const totalCollected = paidBills.reduce((acc, b) => acc + b.amount, 0);
  const totalOutstanding = unpaidBills.reduce((acc, b) => acc + b.totalDue, 0);

  const pendingRequests = requests.filter((r) => r.status === 'Хүлээгдэж буй');

  return (
    <div className="space-y-8">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Paid Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Төлбөрийн гүйцэтгэл</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{paidPercent}%</span>
            <span className="text-xs text-slate-400">({paidBills.length}/{totalUnits} айл)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2: Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Цугларсан төлбөр</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalCollected.toLocaleString()} ₮
            </span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold block">
            Энэ сарын цугларалт
          </span>
        </div>

        {/* Card 3: Outstanding */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Хүлээгдэж буй авлага</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-rose-600">
              {totalOutstanding.toLocaleString()} ₮
            </span>
          </div>
          <span className="text-xs text-slate-400 block">
            {unpaidBills.length} айлын төлбөр дутуу
          </span>
        </div>

        {/* Card 4: Pending requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Шинэ дуудлага, хүсэлт</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">
              {pendingRequests.length}
            </span>
            <span className="text-xs text-slate-400">хүлээгдэж буй</span>
          </div>
          <Link
            href="/admin/requests"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            Хүсэлтүүд рүү очих <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Two columns: Unpaid units list & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unpaid bills summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Төлбөр төлөөгүй айлууд ({unpaidBills.length})
            </h2>
            <Link
              href="/admin/bills"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              Бүгдийг удирдах <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {unpaidBills.slice(0, 8).map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900">{b.unitNumber}-р тоот</span>
                  <span className="text-xs text-slate-400 block">{b.residentName}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-rose-600 block">
                    {b.totalDue.toLocaleString()} ₮
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests list */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Сүүлийн хүсэлт, дуудлагууд
            </h2>
            <Link
              href="/admin/requests"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              Бүгдийг харах <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {requests.slice(0, 5).map((req) => (
              <div key={req.id} className="py-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                      {req.code}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {req.unitNumber}-р тоот
                    </span>
                    <span className="text-[10px] text-slate-500">({req.category})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Шийдвэрлэсэн'
                        ? 'bg-emerald-50 text-emerald-700'
                        : req.status === 'Хянаж байна'
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">{req.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
