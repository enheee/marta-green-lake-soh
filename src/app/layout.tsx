import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Marta Green Lake СӨХ - Нэгдсэн Цахим Портал',
  description: 'Marta Green Lake хотхоны оршин суугчдын төлбөр шалгах, зарлал мэдээлэл авах, санал хүсэлт илгээх нэгдсэн систем',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
