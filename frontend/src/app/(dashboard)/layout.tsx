'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderPOA } from '@/components/ui/HeaderPoa';
import { obtenerRolActivo } from '@/services/api';
import { getMenuItemsByRol } from '@/modules/perfiles/role-menu';
import { useLayoutStore } from '@/store/layout.store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);
  const rolActivo = useLayoutStore((state) => state.rolUsuario);
  const setUsuarioSesion = useLayoutStore((state) => state.setUsuarioSesion);

  useEffect(() => {
    setUsuarioSesion('Mtro. Braulio Vicente', obtenerRolActivo(), 'CUCEI');
  }, [setUsuarioSesion]);

  const menuItems = getMenuItemsByRol(rolActivo);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <aside className="w-36 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="py-6 px-2 flex flex-col items-center border-b border-slate-100">
          <div className="w-24 h-20 rounded-2xl flex items-center justify-center mb-3 overflow-hidden">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Logo SIMA"
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-16 h-16 bg-[#15274D] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md">
                SIMA
              </div>
            )}
          </div>
          <span className="text-[11px] font-black tracking-tight leading-snug text-center px-1 text-[#15274D]">
            Sistema Integral de Monitoreo de Auditorías
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-4">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all group ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600 font-medium'
                }`}
              >
                <svg
                  className={`w-8 h-8 mb-2 transition-transform group-hover:scale-110 ${
                    active ? 'text-indigo-600' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {item.icon}
                </svg>
                <span className="text-[11px] text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

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