import { EstadoSubActividad } from '@prisma/client';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { TipoActividad } from '@prisma/client';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export const MAPA_ESTADOS_SUBACTIVIDADES_A_DOMINIO: Record<
  EstadoSubActividad,
  EstadosActividades
> = {
  [EstadoSubActividad.SIN_EMPEZAR]: EstadosActividades.SIN_EMPEZAR,
  [EstadoSubActividad.SOLICITADO]: EstadosActividades.SOLICITADO,
  [EstadoSubActividad.EN_PROGRESO]: EstadosActividades.EN_PROGRESO,
  [EstadoSubActividad.EN_REVISION]: EstadosActividades.EN_REVISION,
  [EstadoSubActividad.DEVUELTA]: EstadosActividades.DEVUELTA,
  [EstadoSubActividad.CONCLUIDA]: EstadosActividades.CONCLUIDA,
};

export const MAPA_TIPOS_SUBACTIVIDADES_A_DOMINIO: Record<
  TipoActividad,
  TipoSubActividad
> = {
  [TipoActividad.AUDITORIA]: TipoSubActividad.AUDITORIA,
  [TipoActividad.REVISION]: TipoSubActividad.REVISION,
};

export const MAPA_ESTADO_SUBACTIVIDADESS_A_PRISMA: Record<
  EstadosActividades,
  EstadoSubActividad
> = {
  [EstadosActividades.SIN_EMPEZAR]: EstadoSubActividad.SIN_EMPEZAR,
  [EstadosActividades.SOLICITADO]: EstadoSubActividad.SOLICITADO,
  [EstadosActividades.EN_PROGRESO]: EstadoSubActividad.EN_PROGRESO,
  [EstadosActividades.EN_REVISION]: EstadoSubActividad.EN_REVISION,
  [EstadosActividades.DEVUELTA]: EstadoSubActividad.DEVUELTA,
  [EstadosActividades.CONCLUIDA]: EstadoSubActividad.CONCLUIDA,
};

export const MAPA_TIPOS_SUBACTIVIDADES_A_PRISMA: Record<
  TipoSubActividad,
  TipoActividad
> = {
  [TipoSubActividad.AUDITORIA]: TipoActividad.AUDITORIA,
  [TipoSubActividad.REVISION]: TipoActividad.REVISION,
};

export const traducirEstadoSubActividadADominio = (
  estadoPrisma: EstadoSubActividad,
): EstadosActividades => {
  return MAPA_ESTADOS_SUBACTIVIDADES_A_DOMINIO[estadoPrisma];
};

export const traducirEstadoSubActividadAPrisma = (
  estadoDominio: EstadosActividades,
): EstadoSubActividad => {
  return MAPA_ESTADO_SUBACTIVIDADESS_A_PRISMA[estadoDominio];
};

export const traducirTipoSubActividadADominio = (tipoPrisma: TipoActividad) => {
  return MAPA_TIPOS_SUBACTIVIDADES_A_DOMINIO[tipoPrisma];
};

export const traducirTipoSubActividadAPrisma = (
  tipoDominio: TipoSubActividad,
) => {
  return MAPA_TIPOS_SUBACTIVIDADES_A_PRISMA[tipoDominio];
};
