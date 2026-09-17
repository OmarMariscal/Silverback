// frontend/src/services/actividades.adapter.ts
import * as DashApi from '../types/dashboard-api';
import { FilaDirectorioUI } from '../types/actividades-contratos';

export const adaptarDirectorioUI = (
  datosAPI: DashApi.DirectorioResponseDto
): { items: FilaDirectorioUI[]; total: number; paginas: number } => {
  const items: FilaDirectorioUI[] = (datosAPI.data || []).map((item: DashApi.DirectorioItemDto) => {
    const esJefa = item.asignacion.tipo_vista === 'JEFA';

    return {
      id: item.id,
      identificador: item.identificador || 'S/N',
      tipo: item.tipo,
      titulo: item.titulo,
      fechaTerminoTexto: item.fecha_termino,
      
      esVistaJefa: esJefa,
      centroClave: esJefa ? item.asignacion.centro_clave : undefined,
      nombreContralor: esJefa ? item.asignacion.contralor : undefined,
      participacionPorcentaje: !esJefa ? item.asignacion.participacion_porcentaje : undefined,
      auditorApoyo: !esJefa ? item.asignacion.auditor_apoyo : undefined,

      estadoCodigo: item.estado_operativo.codigo,
      estadoEtiqueta: item.estado_operativo.etiqueta || item.estado_operativo.codigo.replace('_', ' '),
      semaforo: item.semaforo
    };
  });

  return {
    items,
    total: datosAPI.meta?.total_registros || 0,
    paginas: datosAPI.meta?.total_paginas || 0
  };
};