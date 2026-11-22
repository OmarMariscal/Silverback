'use client';

import { notFound, useParams } from 'next/navigation';

const PERFILES_VALIDOS = ['admin', 'jefa', 'contralor-general', 'contralor', 'auditor'];

export default function PerfilActividadDetallePlaceholderPage() {
  const params = useParams<{ perfil: string; actividadId: string }>();

  if (!PERFILES_VALIDOS.includes(params.perfil)) {
    notFound();
  }

  return null;
}