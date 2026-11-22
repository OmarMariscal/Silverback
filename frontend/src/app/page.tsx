'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLayoutStore } from '@/store/layout.store';
import { resolveDefaultModulePath } from '@/modules/perfiles/role-menu';

export default function RootPage() {
  const router = useRouter();
  const rolUsuario = useLayoutStore((state) => state.rolUsuario);

  useEffect(() => {
    router.replace(resolveDefaultModulePath(rolUsuario));
  }, [router, rolUsuario]);

  return <p className="p-8 text-sm text-slate-500">Abriendo el espacio de trabajo...</p>;
}