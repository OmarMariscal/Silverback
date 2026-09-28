'use client';

import RoleShell from '@/modules/perfiles/role-shell';

export default function ContralorGeneralActividadesPage() {
  return (
    <RoleShell
      perfil="CONTRALOR_GENERAL"
      modulo="actividades"
      title="Actividades institucionales"
      subtitle="Directorio centralizado de actividades en revisión y operación por centro."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ['Total', '189', 'Actividades registradas'],
          ['Criticas', '12', 'Con riesgo mayor'],
          ['Concluidas', '94', 'Avance total'],
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
