'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RoleShell from '@/modules/perfiles/role-shell';
import { getModulePath, moduleApiSupport, roleModuleMap } from '@/modules/perfiles/role-menu';
import { actividadesService } from '@/services/actividades.service';
import type { ActividadResumenResponse } from '@/types/actividades-api';
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
  const [actividad, setActividad] = useState<ActividadResumenResponse | null>(null);
  const [error, setError] = useState<{ actividadId: string; mensaje: string } | null>(null);

  useEffect(() => {
    if (!rol || !moduleApiSupport[rol].actividades) return;

    let mounted = true;

    actividadesService.obtenerResumen(actividadId)
      .then((resultado) => {
        if (mounted) setActividad(resultado);
      })
      .catch((cause: unknown) => {
        console.error('No se pudo cargar el resumen de la actividad', cause);
        if (mounted) {
          setError({ actividadId, mensaje: 'No se pudo cargar el detalle de la actividad.' });
        }
      });

    return () => {
      mounted = false;
    };
  }, [actividadId, rol]);

  if (!rol || !moduleApiSupport[rol].actividades) notFound();

  const errorActual = error?.actividadId === actividadId ? error.mensaje : null;
  const cargando = actividad?.id !== actividadId && !errorActual;

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

      {cargando ? (
        <p className="mt-6 text-sm font-semibold text-indigo-600">Cargando detalle...</p>
      ) : errorActual ? (
        <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
          {errorActual}
        </p>
      ) : actividad ? (
        <article className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">{actividad.titulo}</h2>
          {([
            ['Justificación', actividad.justificacion],
            ['Objetivo general', actividad.objetivo_general],
            ['Objetivos particulares', actividad.objetivos_particulares],
            ['Meta del proyecto', actividad.meta_del_proyecto],
            ['Indicadores', actividad.indicadores],
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
