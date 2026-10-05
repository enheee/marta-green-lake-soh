'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Building2,
  Phone,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  QrCode,
  Key,
  ShieldAlert,
} from 'lucide-react';
import { SohSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SohSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Хадгалахад алдаа гарлаа.');
      }
    } catch (err) {
      alert('Холболтын алдаа.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChange = (index: number, field: string, value: string) => {
    if (!settings) return;
    const updatedPhones = [...settings.emergencyPhones];
    updatedPhones[index] = { ...updatedPhones[index], [field]: value };
    setSettings({ ...settings, emergencyPhones: updatedPhones });
  };

  const handleBankChange = (index: number, field: string, value: string) => {
    if (!settings) return;
    const updatedBanks = [...settings.bankAccounts];
    updatedBanks[index] = { ...updatedBanks[index], [field]: value };
    setSettings({ ...settings, bankAccounts: updatedBanks });
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-slate-400 text-sm">Ачаалж байна...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">СӨХ-ийн Тохиргоо</h2>
          <p className="text-xs text-slate-500">
            СӨХ-ийн нэр, хаяг, яаралтай холбогдох утаснууд болон төлбөрийн дансыг шинэчлэх
          </p>
        </div>

        {success && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Амжилттай хадгалагдлаа!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-600" />
            Ерөнхий мэдээлэл
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                СӨХ-ийн нэр
              </label>
              <input
                type="text"
                value={settings.sohName}
                onChange={(e) => setSettings({ ...settings, sohName: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Байрны нэр
              </label>
              <input
                type="text"
                value={settings.buildingName}
                onChange={(e) => setSettings({ ...settings, buildingName: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Байршлын хаяг
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Emergency Phones */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-sky-600" />
            Шуурхай дуудлагын утаснууд
          </h3>

          <div className="space-y-3">
            {settings.emergencyPhones.map((phone, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Албан тушаал"
                  value={phone.title}
                  onChange={(e) => handlePhoneChange(idx, 'title', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="Нэр"
                  value={phone.name}
                  onChange={(e) => handlePhoneChange(idx, 'name', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="Утасны дугаар"
                  value={phone.phone}
                  onChange={(e) => handlePhoneChange(idx, 'phone', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-600" />
            Төлбөр хүлээн авах банкны данснууд
          </h3>

          <div className="space-y-3">
            {settings.bankAccounts.map((acc, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Банкны нэр"
                  value={acc.bankName}
                  onChange={(e) => handleBankChange(idx, 'bankName', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="Дансны дугаар"
                  value={acc.accountNumber}
                  onChange={(e) => handleBankChange(idx, 'accountNumber', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono"
                />
                <input
                  type="text"
                  placeholder="Хүлээн авагчийн нэр"
                  value={acc.accountName}
                  onChange={(e) => handleBankChange(idx, 'accountName', e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            ))}
          </div>
        </div>

        {/* QPay Gateway Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-red-600" />
              QPay төлбөрийн гарцын тохиргоо (API холболт)
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.qpayConfig?.enabled ?? false}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    qpayConfig: {
                      ...(settings.qpayConfig || { enabled: false }),
                      enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-xs font-bold text-slate-700">Идэвхжүүлэх</span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            QPay (qpay.mn)-тэй мерчантын гэрээ байгуулж авсан албан ёсны API түлхүүрүүдээ оруулна уу. Түлхүүр оруулаагүй үед систем автоматаар туршилтын интерактив горимоор ажиллана.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Client ID (Мерчант хэрэглэгчийн нэр)
              </label>
              <input
                type="text"
                placeholder="Жишээ: MARTA_SOH_USER"
                value={settings.qpayConfig?.clientId || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    qpayConfig: {
                      ...(settings.qpayConfig || { enabled: true }),
                      clientId: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:bg-white focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Client Secret (Нууц түлхүүр)
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={settings.qpayConfig?.clientSecret || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    qpayConfig: {
                      ...(settings.qpayConfig || { enabled: true }),
                      clientSecret: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:bg-white focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Invoice Code (Нэхэмжлэхийн код)
              </label>
              <input
                type="text"
                placeholder="Жишээ: MARTA_SOH_INVOICE"
                value={settings.qpayConfig?.invoiceCode || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    qpayConfig: {
                      ...(settings.qpayConfig || { enabled: true }),
                      invoiceCode: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:bg-white focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Merchant ID (Сонголттой)
              </label>
              <input
                type="text"
                placeholder="Жишээ: MGL-SOH-8493"
                value={settings.qpayConfig?.merchantId || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    qpayConfig: {
                      ...(settings.qpayConfig || { enabled: true }),
                      merchantId: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:bg-white focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Хадгалж байна...' : 'Тохиргоог хадгалах'}</span>
        </button>
      </form>
    </div>
  );
}
