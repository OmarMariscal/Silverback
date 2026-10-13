'use client';

import RoleShell from '@/modules/perfiles/role-shell';

export default function ContralorGeneralDashboardPage() {
  return (
    <RoleShell
      perfil="CONTRALOR_GENERAL"
      modulo="dashboard"
      title="Panel de Gestión - Contraloría General"
      subtitle="Supervisión institucional, indicadores por centro y consolidación de resultados del sistema."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Centros monitoreados', '12', 'Unidades bajo control'],
          ['Actividades en revisión', '27', 'Pendientes de decisión'],
          ['POAs con riesgo', '4', 'Necesitan intervención'],
          ['Eficiencia global', '89%', 'A nivel institucional'],
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
