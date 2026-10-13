'use client';

import RoleShell from '@/modules/perfiles/role-shell';

export default function AuditorDashboardPage() {
  return (
    <RoleShell
      perfil="AUDITOR"
      modulo="dashboard"
      title="Panel de Gestión - Auditor"
      subtitle="Seguimiento operativo de actividades asignadas y carga de trabajo del auditor."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Asignadas', '09', 'Actividades actuales'],
          ['En progreso', '05', 'Trabajo activo'],
          ['Vencidas', '02', 'Requieren atención'],
          ['Cumplimiento', '76%', 'Avance general'],
        ].map(([label, value, helper]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-5 text-4xl font-black text-slate-800">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{helper}</p>
          </div>
        ))}
      </div>
    </RoleShell>
  );
}
