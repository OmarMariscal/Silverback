'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderPOA } from '@/components/ui/HeaderPoa';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <aside className="w-36 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="py-8 flex flex-col items-center border-b border-slate-100">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-lg shadow-indigo-200 mb-3">
            C
          </div>
          <span className="text-sm font-black text-slate-800 tracking-tight leading-none text-center">
            SISTEMA<br />INTEGRAL
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-4">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all group ${
              isActive('/dashboard')
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600 font-medium'
            }`}
          >
            <svg
              className={`w-8 h-8 mb-2 transition-transform group-hover:scale-110 ${
                isActive('/dashboard') ? 'text-indigo-600' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
            <span className="text-[11px] text-center leading-tight">
              Dashboard
            </span>
          </Link>

          {/* Actividades */}
          <Link
            href="/actividades"
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all group ${
              isActive('/actividades')
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600 font-medium'
            }`}
          >
            <svg
              className={`w-8 h-8 mb-2 transition-transform group-hover:scale-110 ${
                isActive('/actividades') ? 'text-indigo-600' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            <span className="text-[11px] text-center leading-tight">
              Actividades
            </span>
          </Link>

          {/* POA */}
          <Link
            href="/poa"
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all group ${
              isActive('/poa')
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600 font-medium'
            }`}
          >
            <svg
              className={`w-8 h-8 mb-2 transition-transform group-hover:scale-110 ${
                isActive('/poa') ? 'text-indigo-600' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              ></path>
            </svg>
            <span className="text-[11px] text-center leading-tight">
              POA
            </span>
          </Link>
        </nav>

        <div className="py-4 px-3 border-t border-slate-100">
          <Link
            href="/ajustes"
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all group ${
              isActive('/ajustes')
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-800 font-medium'
            }`}
          >
            <svg
              className={`w-7 h-7 mb-1.5 transition-transform group-hover:scale-110 ${
                isActive('/ajustes') ? 'text-indigo-600' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span className="text-[10px] text-center">Ajustes</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        <HeaderPOA />

        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}