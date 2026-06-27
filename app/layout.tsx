'use client';
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <html lang="bn">
      <body className="min-h-screen bg-gray-50">
        {!isAdmin && <Navbar />}
        <div className={!isAdmin ? 'pt-16' : ''}>
          {children}
        </div>
        {!isAdmin && <Footer />}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}