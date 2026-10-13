// frontend/src/services/dashboard.adapter.ts
import * as DashApi from '../types/dashboard-api';
import { 
  DashboardContralorUI, 
  ItemVencimientoProps, 
  FilaSupervisionProps,
  DashboardJefaUI
} from '../types/dashboard-contratos';

export const adaptarDashboardContralorUI = (
  kpisDto: DashApi.DashboardContralorDto,
  vencimientosDto: DashApi.ProximasVencerResponseDto,
  supervisionDto: DashApi.SupervisionResponseDto
): DashboardContralorUI => {
  // 1. Cálculo de Conic Gradient para Semáforos
  const sem = kpisDto.graficas.semaforos;
  const totalSem = sem.total > 0 ? sem.total : sem.a_tiempo + sem.alerta + sem.critico;
  
  const pctCritico = totalSem > 0 ? (sem.critico / totalSem) * 100 : 0;
  const pctAlerta = totalSem > 0 ? (sem.alerta / totalSem) * 100 : 0;
  const p1 = pctCritico;
  const p2 = p1 + pctAlerta;
  
  const gradientSemaforos = totalSem > 0
    ? `conic-gradient(#ef4444 0% ${p1}%, #f59e0b ${p1}% ${p2}%, #10b981 ${p2}% 100%)`
    : 'conic-gradient(#cbd5e1 0% 100%)';

  // 2. Cálculo de Conic Gradient para Flujo de Trabajo
  const flujo = kpisDto.graficas.flujo;
  const totalFlujo = flujo.total > 0 ? flujo.total : (flujo.sin_empezar + flujo.en_proceso + flujo.por_revisar + flujo.concluidas);
  
  const fSin = totalFlujo > 0 ? (flujo.sin_empezar / totalFlujo) * 100 : 0;
  const fProc = totalFlujo > 0 ? (flujo.en_proceso / totalFlujo) * 100 : 0;
  const fRev = totalFlujo > 0 ? (flujo.por_revisar / totalFlujo) * 100 : 0;
  
  const fp1 = fSin;
  const fp2 = fp1 + fProc;
  const fp3 = fp2 + fRev;

  const gradientFlujo = totalFlujo > 0
    ? `conic-gradient(#94a3b8 0% ${fp1}%, #3b82f6 ${fp1}% ${fp2}%, #8b5cf6 ${fp2}% ${fp3}%, #10b981 ${fp3}% 100%)`
    : 'conic-gradient(#cbd5e1 0% 100%)';

  // 3. Mapeo de Próximos Vencimientos
  const proximosVencimientos: ItemVencimientoProps[] = (vencimientosDto.data || []).map((v) => {
    let color: 'red' | 'amber' | 'emerald' = 'emerald';
    if (v.estado_semaforo === 'CRITICO') color = 'red';
    if (v.estado_semaforo === 'PRECAUCION') color = 'amber';

    return {
      id: v.id,
      titulo: v.titulo,
      fechaTexto: v.fecha_vencimiento,
      etiquetaTiempo: v.etiqueta_tiempo,
      colorSemaforo: color
    };
  });

  // 4. Mapeo de Bandeja de Supervisión
  const bandejaSupervision: FilaSupervisionProps[] = (supervisionDto.data || []).map((s) => {
    let tipo: 'DEVUELTA_OBS' | 'DEVUELTA_REC' | 'CONCLUIDA' = 'CONCLUIDA';
    if (s.resolucion_jefa.mensaje.toLowerCase().includes('observacion')) tipo = 'DEVUELTA_OBS';
    if (s.resolucion_jefa.mensaje.toLowerCase().includes('recomendacion')) tipo = 'DEVUELTA_REC';

    return {
      id: s.id,
      titulo: s.titulo,
      tiempoTranscurrido: s.enviada_hace,
      resolucionTexto: s.resolucion_jefa.mensaje,
      resolucionTipo: tipo,
      vencimientoTexto: s.vencimiento_poa.etiqueta,
      vencimientoFecha: s.vencimiento_poa.fecha_texto
    };
  });

  return {
    centroNombre: `${kpisDto.centro_universitario.nombre} (${kpisDto.centro_universitario.clave})`,
    kpis: {
      devueltas: kpisDto.tarjetas.bandeja_entrada.devueltas,
      listasParaEmpezar: kpisDto.tarjetas.bandeja_entrada.listas_empezar,
      riesgoCritico: kpisDto.tarjetas.riesgo_critico,
      precaucion: kpisDto.tarjetas.precaucion,
      tasaSolventacion: kpisDto.tarjetas.tasa_solventacion
    },
    graficaSemaforos: {
      titulo: 'Mi Estado de Semáforos',
      totalCentral: totalSem,
      subtituloCentral: 'Mi POA',
      gradientStyle: gradientSemaforos,
      leyendas: [
        { etiqueta: 'A Tiempo', cantidad: sem.a_tiempo, colorHex: '#10b981' },
        { etiqueta: 'Alerta', cantidad: sem.alerta, colorHex: '#f59e0b' },
        { etiqueta: 'Crítico', cantidad: sem.critico, colorHex: '#ef4444' }
      ]
    },
    graficaFlujo: {
      titulo: 'Mi Flujo de Trabajo',
      totalCentral: totalFlujo,
      subtituloCentral: 'Total',
      gradientStyle: gradientFlujo,
      leyendas: [
        { etiqueta: 'Sin empezar', cantidad: flujo.sin_empezar, colorHex: '#94a3b8' },
        { etiqueta: 'En Proceso', cantidad: flujo.en_proceso, colorHex: '#3b82f6' },
        { etiqueta: 'Por Revisar', cantidad: flujo.por_revisar, colorHex: '#8b5cf6' },
        { etiqueta: 'Concluidas', cantidad: flujo.concluidas, colorHex: '#10b981' }
      ]
    },
    proximosVencimientos,
    bandejaSupervision
  };
};

export const adaptarDashboardJefaUI = (
  kpisDto: DashApi.DashboardJefaDto,
  rezagoDto: DashApi.RezagoResponseDto,
  directorioDto: DashApi.DirectorioResponseDto
): DashboardJefaUI => {
  const ts = kpisDto.tarjetas_superiores;

  // Gráfica de Semáforos Red
  const sem = kpisDto.grafica_semaforos;
  const totalSem = sem.total_actividades_red > 0 ? sem.total_actividades_red : sem.a_tiempo + sem.alerta + sem.critico;
  const pctCritico = totalSem > 0 ? (sem.critico / totalSem) * 100 : 0;
  const pctAlerta = totalSem > 0 ? (sem.alerta / totalSem) * 100 : 0;
  const gradientSemaforos = totalSem > 0
    ? `conic-gradient(#ef4444 0% ${pctCritico}%, #f59e0b ${pctCritico}% ${pctCritico + pctAlerta}%, #10b981 ${pctCritico + pctAlerta}% 100%)`
    : 'conic-gradient(#cbd5e1 0% 100%)';

  // Gráfica de Distribución de Estado
  const dist = kpisDto.grafica_distribucion_estado;
  const totalDist = dist.total_actividades_red;
  const fSin = totalDist > 0 ? (dist.sin_empezar / totalDist) * 100 : 0;
  const fProc = totalDist > 0 ? (dist.en_proceso / totalDist) * 100 : 0;
  const fRev = totalDist > 0 ? (dist.por_revisar / totalDist) * 100 : 0;
  const fp1 = fSin;
  const fp2 = fp1 + fProc;
  const fp3 = fp2 + fRev;
  const gradientDistribucion = totalDist > 0
    ? `conic-gradient(#94a3b8 0% ${fp1}%, #3b82f6 ${fp1}% ${fp2}%, #8b5cf6 ${fp2}% ${fp3}%, #10b981 ${fp3}% 100%)`
    : 'conic-gradient(#cbd5e1 0% 100%)';

  return {
    kpis: {
      actividadesPorRevisar: ts.pendientes.actividades_por_revisar,
      actividadesSolicitadas: ts.pendientes.actividades_solicitadas,
      riesgoCritico: ts.riesgo_critico.total,
      riesgoCriticoDescripcion: ts.riesgo_critico.descripcion,
      precaucion: ts.precaucion.total,
      precaucionDescripcion: ts.precaucion.descripcion,
      tasaSolventacion: ts.tasa_solventacion.porcentaje,
      tendenciaMes: ts.tasa_solventacion.tendencia_mes,
    },
    graficaSemaforos: {
      titulo: 'Semáforos en la Red',
      totalCentral: totalSem,
      subtituloCentral: 'Actividades Red',
      gradientStyle: gradientSemaforos,
      leyendas: [
        { etiqueta: 'A Tiempo', cantidad: sem.a_tiempo, colorHex: '#10b981' },
        { etiqueta: 'Alerta', cantidad: sem.alerta, colorHex: '#f59e0b' },
        { etiqueta: 'Crítico', cantidad: sem.critico, colorHex: '#ef4444' },
      ],
    },
    graficaDistribucion: {
      titulo: 'Distribución por Estado',
      totalCentral: totalDist,
      subtituloCentral: 'Total Red',
      gradientStyle: gradientDistribucion,
      leyendas: [
        { etiqueta: 'Sin empezar', cantidad: dist.sin_empezar, colorHex: '#94a3b8' },
        { etiqueta: 'En Proceso', cantidad: dist.en_proceso, colorHex: '#3b82f6' },
        { etiqueta: 'Por Revisar', cantidad: dist.por_revisar, colorHex: '#8b5cf6' },
        { etiqueta: 'Concluidas', cantidad: dist.concluidas, colorHex: '#10b981' },
      ],
    },
    rezago: (rezagoDto.data || []).map((r) => ({
      centroId: r.centro_id,
      centroClave: r.centro_clave,
      centroNombre: r.centro_nombre,
      actividadesCriticas: r.distribucion.actividades_criticas,
      actividadesPrecaucion: r.distribucion.actividades_precaucion,
      total: r.distribucion.total,
    })),
    directorio: (directorioDto.data || []).map((d) => ({
      id: d.id,
      identificador: d.identificador || 'S/N',
      tipo: d.tipo,
      titulo: d.titulo,
      centroClave: d.asignacion?.centro_clave || 'Red',
      contralor: d.asignacion?.contralor || 'Sin asignar',
      estadoEtiqueta: d.estado_operativo?.etiqueta || d.estado_operativo?.codigo || 'En proceso',
      fechaTermino: d.fecha_termino,
    })),
  };
};