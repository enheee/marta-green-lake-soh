import Link from 'next/link';
import { Building2, Phone, MapPin, ShieldAlert, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg">Marta Green Lake СӨХ</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Оршин суугчдын тав тухтай, аюулгүй, цэвэр цэмцгэр орчныг бүрдүүлэх нэгдсэн цахим систем.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <a
                href="https://maps.app.goo.gl/wEUdBYZkreUJhD2F8"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 hover:underline transition-colors flex items-center gap-1"
              >
                <span>СБД, 9-р хороо, Marta Green Lake хотхон (Газрын зураг ↗)</span>
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Шуурхай холбоосууд
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/bills" className="hover:text-sky-400 transition-colors">
                  Төлбөрийн үлдэгдэл шалгах
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-sky-400 transition-colors">
                  Зарлал, сэрэмжлүүлэг
                </Link>
              </li>
              <li>
                <Link href="/requests" className="hover:text-sky-400 transition-colors">
                  Гэмтэл, дуудлага өгөх
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-sky-400 transition-colors">
                  Санхүүгийн нээлттэй тайлан
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              24/7 Түргэн тусламж
            </h4>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-slate-400">Байрны жижүүр:</span>
                <a href="tel:99223344" className="font-semibold text-sky-400 hover:underline flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> 9922-3344
                </a>
              </div>
              <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-slate-400">Сантехникч:</span>
                <a href="tel:99334455" className="font-semibold text-sky-400 hover:underline flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> 9933-4455
                </a>
              </div>
              <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-slate-400">Цахилгаанчин:</span>
                <a href="tel:99445566" className="font-semibold text-sky-400 hover:underline flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> 9944-5566
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Marta Green Lake СӨХ. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Оршин суугчдын тав тухын төлөө</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
