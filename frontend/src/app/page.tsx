'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerRolActivo } from '@/services/api';
import { resolveDefaultModulePath } from '@/modules/perfiles/role-menu';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(resolveDefaultModulePath(obtenerRolActivo()));
  }, [router]);

  return <p className="p-8 text-sm text-slate-500">Abriendo el espacio de trabajo...</p>;
}
