// frontend/src/services/actividades.adapter.ts
// Este archivo contiene funciones para adaptar los datos de actividades obtenidos del backend a un formato que sea más conveniente para la interfaz de usuario. Estas funciones transforman los datos crudos en estructuras que los componentes de React pueden utilizar directamente.
// En palabras sencillas: Este archivo es como un "traductor" que toma los datos del backend y los convierte en un idioma que la interfaz de usuario entiende mejor. Esto facilita la construcción de componentes y la presentación de información al usuario final.

import type {
  ActividadesDirectorioData,
  ActividadResumenResponse,
} from '@/types/actividades-api';
import type { CentroDataDto } from '@/types/poa-api';
import type {
  ActividadDirectorioUI,
  ActividadResumenUI,
  CentroUI,
} from '@/types/actividades-contratos';

const estadoLabels: Record<string, string> = {
  SIN_EMPEZAR: 'Sin Empezar',
  SOLICITADO: 'Por Autorizar',
  EN_PROGRESO: 'En Proceso',
  EN_REVISION: 'Por Revisar',
  DEVUELTA: 'Devuelta',
  CONCLUIDA: 'Concluida',
};

const semaforoLabels: Record<string, string> = {
  A_TIEMPO: 'A Tiempo',
  VERDE: 'A Tiempo',
  PRECAUCION: 'En Alerta',
  AMARILLO: 'En Alerta',
  CRITICO: 'Crítico',
  ROJO: 'Crítico',
  GRIS: 'N/A',
};

const semaforoClasses: Record<string, string> = {
  A_TIEMPO: 'bg-emerald-500',
  VERDE: 'bg-emerald-500',
  PRECAUCION: 'bg-amber-400',
  AMARILLO: 'bg-amber-400',
  CRITICO: 'bg-red-500',
  ROJO: 'bg-red-500',
  GRIS: 'bg-slate-300',
};

const estadoClasses: Record<string, string> = {
  DEVUELTA: 'border-red-200 bg-red-50 text-red-700',
  EN_PROGRESO: 'border-blue-200 bg-blue-50 text-blue-700',
  EN_REVISION: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  CONCLUIDA: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export const adaptarDirectorioActividadesUI = (
  actividades: ActividadesDirectorioData[],
): ActividadDirectorioUI[] =>
  actividades.map((actividad) => {
    const esVistaJefatura = actividad.asignacion.tipo_vista === 'JEFA';
    const estadoCodigo = actividad.estado_operativo.codigo;
    const semaforoCodigo = actividad.semaforo;
    const fecha = new Date(actividad.fecha_termino);
    const fechaTermino = Number.isNaN(fecha.getTime())
      ? actividad.fecha_termino
      : new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric' }).format(fecha);

    return {
      id: actividad.id,
      identificador: actividad.identificador || 'Sin asignar',
      tipoActividad: actividad.tipo,
      tipoEtiqueta: actividad.tipo === 'AUDITORIA' ? 'Auditoría' : 'Revisión',
      titulo: actividad.titulo,
      fechaTermino,
      asignacionPrincipal: esVistaJefatura
        ? actividad.asignacion.centro_clave || 'Sin centro'
        : `${actividad.asignacion.participacion_porcentaje ?? 0}%`,
      asignacionSecundaria: esVistaJefatura
        ? actividad.asignacion.contralor || actividad.asignacion.auditor_apoyo || 'Sin responsable'
        : actividad.asignacion.auditor_apoyo || 'Sin auditores asignados',
      estadoCodigo,
      estadoEtiqueta:
        actividad.estado_operativo.etiqueta || estadoLabels[estadoCodigo] || 'Sin estado',
      estadoClase:
        estadoClasses[estadoCodigo] || 'border-slate-200 bg-slate-50 text-slate-700',
      semaforoCodigo,
      semaforoEtiqueta: semaforoLabels[semaforoCodigo] || semaforoCodigo,
      semaforoClase: semaforoClasses[semaforoCodigo] || semaforoClasses.GRIS,
    };
  });

export const adaptarCentrosUI = (centros: CentroDataDto[]): CentroUI[] =>
  centros.map((centro) => ({
    id: centro.id,
    clave: centro.clave,
    nombre: centro.nombre,
    subtituloInterfaz: centro.subtitulo_interfaz,
  }));

export const adaptarResumenActividadUI = (
  actividad: ActividadResumenResponse,
): ActividadResumenUI => ({
  id: actividad.id,
  titulo: actividad.titulo,
  justificacion: actividad.justificacion,
  objetivoGeneral: actividad.objetivo_general,
  objetivosParticulares: actividad.objetivos_particulares,
  metaDelProyecto: actividad.meta_del_proyecto,
  indicadores: actividad.indicadores,
});
