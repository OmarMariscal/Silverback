'use client';

import RoleShell from '@/modules/perfiles/role-shell';

export default function AuditorPoaPage() {
  return (
    <RoleShell
      perfil="AUDITOR"
      modulo="poa"
      title="POA asignado"
      subtitle="Consulta del plan operativo vinculado a la carga de trabajo del auditor."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ['Asignado', '03', 'POAs bajo mi responsabilidad'],
          ['Activos', '02', 'En ejecución'],
          ['Pendientes', '01', 'Por iniciar'],
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
