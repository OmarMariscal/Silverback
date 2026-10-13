'use client';

import RoleShell from '@/modules/perfiles/role-shell';

export default function AuditorActividadesPage() {
  return (
    <RoleShell
      perfil="AUDITOR"
      modulo="actividades"
      title="Actividades asignadas"
      subtitle="Carga operativa, avance y seguimiento de las actividades que corresponden al auditor."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ['Asignadas', '09', 'Total activo'],
          ['En curso', '05', 'Trabajando'],
          ['Pendientes', '04', 'Faltantes por cerrar'],
        ].map(([label, value, helper]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-5 text-3xl font-black text-slate-800">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{helper}</p>
          </div>
        ))}
      </div>
    </RoleShell>
  );
}
