'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  CreditCard,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Lock,
  ArrowRight,
  CheckCircle2,
  Vote,
  Car,
  Gauge,
  Package,
  Video,
  Layers,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('soh_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: admin123 or 1234
    if (pin === 'admin123' || pin === '1234' || pin === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('soh_admin_auth', 'true');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('soh_admin_auth');
    setIsAuthenticated(false);
    setPin('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">СӨХ-ийн Админ нэвтрэх</h2>
            <p className="text-xs text-slate-500">
              СӨХ-ийн удирдах ажилтны нууц кодыг оруулна уу
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Нууц үг
              </label>
              <input
                type="password"
                placeholder="Нууц код (Жишээ: admin123)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-center text-base tracking-widest font-mono font-bold focus:bg-white focus:border-sky-600 focus:outline-none"
              />
              {error && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5 text-center">
                  Нууц үг буруу байна! (Анхны тохиргооны код: <span className="underline">admin123</span>)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Нэвтрэх</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
            >
              ← Оршин суугчийн портал руу буцах
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminNav = [
    { name: 'Хяналтын самбар', href: '/admin', icon: LayoutDashboard },
    { name: 'Төлбөр & Баримт', href: '/admin/bills', icon: CreditCard },
    { name: 'Санхүүгийн тайлан', href: '/admin/reports', icon: Layers },
    { name: 'Тоолуурын заалт', href: '/admin/meters', icon: Gauge },
    { name: 'Жижүүрийн илгээмж', href: '/admin/deliveries', icon: Package },
    { name: 'Камерын бичлэг', href: '/admin/cctv', icon: Video },
    { name: 'Санал асуулга', href: '/admin/polls', icon: Vote },
    { name: 'Автомашин & Зогсоол', href: '/admin/parking', icon: Car },
    { name: 'Зарлал удирдах', href: '/admin/announcements', icon: Bell },
    { name: 'Хүсэлт, гомдол', href: '/admin/requests', icon: MessageSquare },
    { name: 'СӨХ тохиргоо', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Top Banner */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white flex items-center gap-2">
              СӨХ-ийн Удирдлагын Хэсэг
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Админ
              </span>
            </h1>
            <p className="text-xs text-slate-400">Marta Green Lake СӨХ удирдлагын нэгдсэн систем</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <span>Вебсайт харах</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center gap-1.5 transition-colors border border-rose-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Гарах</span>
          </button>
        </div>
      </div>

      {/* Admin Nav Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-slate-200 no-scrollbar">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Admin Content Area */}
      <div>{children}</div>
    </div>
  );
}
