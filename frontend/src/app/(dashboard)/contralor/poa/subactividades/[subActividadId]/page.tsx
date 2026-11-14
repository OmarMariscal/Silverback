'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import RoleShell from '@/modules/perfiles/role-shell';
import ContenedorSubactividad from '@/components/poa/ContenedorSubactividad';
import BtnReintentar from '@/components/ui/BtnReintentar';
import EstadoCarga from '@/components/ui/EstadoCarga';
import { useSubActividadEntregaStore } from '@/store/subactividades-entrega.store';

export default function EntregaSubactividadPage() {
  const { subActividadId } = useParams<{ subActividadId: string }>();
  const store = useSubActividadEntregaStore();
  const inicializarVista = useSubActividadEntregaStore((state) => state.inicializarVista);

  useEffect(() => {
      if (subActividadId) void inicializarVista(subActividadId);
  }, [inicializarVista, subActividadId]);

  const vista = store.obtenerViewModelUI();
  const vistaPerteneceARuta = vista?.subActividadId === subActividadId;

  if (store.estaCargando || (!vistaPerteneceARuta && !store.mensajeError)) {
    return (
      <RoleShell perfil="CONTRALOR" modulo="poa" title="Entrega de subactividad" subtitle="Cargando información de la entrega...">
        <EstadoCarga 
          mensaje="Cargando información de la subactividad..."
          variante="spinner"
        />
      </RoleShell>
    );
  }
    
  if (store.mensajeError || !vista) {
    return (
      <RoleShell perfil="CONTRALOR" modulo="poa" title="Entrega de subactividad" subtitle="¡ERROR!">
        <BtnReintentar
          mensajePrincipal="No se pudo cargar la información de la subactividad."
          mensajeSecundario={store.mensajeError || 'Ocurrió un error inesperado al intentar obtener la información de la subactividad.'}
          onClickReintentar={() => inicializarVista(subActividadId)}
        />
      </RoleShell>
    );
  }

  return (
    <RoleShell
      perfil="CONTRALOR"
      modulo="poa"
      title="Entrega de subactividad"
      subtitle="Consulta el estado, atiende las observaciones y presenta las evidencias correspondientes."
    >
      <ContenedorSubactividad vista={vista} />
    </RoleShell>
  );
}