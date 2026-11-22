'use client';

import { notFound, useParams } from 'next/navigation';

const PERFILES_VALIDOS = ['admin', 'jefa', 'contralor-general', 'contralor', 'auditor'];
const MODULOS_VALIDOS = ['dashboard', 'actividades', 'poa'];

export default function PerfilModuloPlaceholderPage() {
  const params = useParams<{ perfil: string; modulo: string }>();

  if (
    !PERFILES_VALIDOS.includes(params.perfil) ||
    !MODULOS_VALIDOS.includes(params.modulo)
  ) {
    notFound();
  }

  return null;
}