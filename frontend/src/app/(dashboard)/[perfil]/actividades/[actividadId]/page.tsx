'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';
import RoleShell from '@/modules/perfiles/role-shell';
import { getModulePath, moduleApiSupport, roleModuleMap } from '@/modules/perfiles/role-menu';
import { useActividadesStore } from '@/store/actividades.store';
import { ROLES_USUARIO, type RolUsuario } from '@/types/roles';

const roleLabels: Record<RolUsuario, string> = {
  ADMIN: 'Administrador',
  JEFA: 'Jefatura',
  CONTRALOR_GENERAL: 'Contraloría General',
  CONTRALOR: 'Contralor',
  AUDITOR: 'Auditor',
};

export default function ActividadDetallePage() {
  const { perfil, actividadId } = useParams<{ perfil: string; actividadId: string }>();
  const rol = ROLES_USUARIO.find(
    (candidate) => roleModuleMap[candidate].actividades === `/${perfil}/actividades`,
  );
  const actividad = useActividadesStore((state) => state.actividadDetalle);
  const actividadDetalleSolicitadaId = useActividadesStore((state) => state.actividadDetalleSolicitadaId);
  const cargando = useActividadesStore((state) => state.cargandoDetalle);
  const error = useActividadesStore((state) => state.errorDetalle);
  const cargarResumenActividad = useActividadesStore((state) => state.cargarResumenActividad);

  useEffect(() => {
    if (!rol || !moduleApiSupport[rol].actividades) return;
    void cargarResumenActividad(actividadId);
  }, [actividadId, cargarResumenActividad, rol]);

  if (!rol || !moduleApiSupport[rol].actividades) notFound();

  const errorActual = actividadDetalleSolicitadaId === actividadId ? error : null;
  const actividadActual = actividad?.id === actividadId ? actividad : null;
  const estaCargando = actividadDetalleSolicitadaId !== actividadId || cargando;

  return (
    <RoleShell
      perfil={rol}
      modulo="actividades"
      title="Detalle de actividad"
      subtitle={`Consulta técnica de actividad para ${roleLabels[rol]}.`}
    >
      <Link
        href={getModulePath(rol, 'actividades')}
        className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
      >
        Volver al directorio
      </Link>

      {estaCargando ? (
        <p className="mt-6 text-sm font-semibold text-indigo-600">Cargando detalle...</p>
      ) : errorActual ? (
        <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
          {errorActual}
        </p>
      ) : actividadActual ? (
        <article className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">{actividadActual.titulo}</h2>
          {([
            ['Justificación', actividadActual.justificacion],
            ['Objetivo general', actividadActual.objetivoGeneral],
            ['Objetivos particulares', actividadActual.objetivosParticulares],
            ['Meta del proyecto', actividadActual.metaDelProyecto],
            ['Indicadores', actividadActual.indicadores],
          ] as Array<[string, string]>).map(([label, value]) => (
            <section key={label}>
              <h3 className="text-sm font-bold text-slate-700">{label}</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{value}</p>
            </section>
          ))}
        </article>
      ) : (
        <p className="mt-6 text-sm text-slate-600">No se encontró información para esta actividad.</p>
      )}
    </RoleShell>
  );
}
