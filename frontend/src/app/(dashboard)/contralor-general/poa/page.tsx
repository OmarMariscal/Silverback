'use client';

import RoleShell from '@/modules/perfiles/role-shell';

export default function ContralorGeneralPoaPage() {
  return (
    <RoleShell
      perfil="CONTRALOR_GENERAL"
      modulo="poa"
      title="POA institucional"
      subtitle="Seguimiento de la cartera operativa y el cumplimiento de los centros bajo dirección general."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ['POAs activos', '22', 'Total institucional'],
          ['Con aprobación', '16', 'En operación'],
          ['En revisión', '06', 'Pendientes'],
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
