import {
  EstadoArchivoEvidencia,
  EstadoDictamen,
  EstadoSubActividad,
  TipoActividad,
} from '@prisma/client';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';
import { EstadosArchivoEvidencia } from '@domain/actividad/estados-archivo-evidencia.enum';
import { EstadosDictamen } from '@domain/actividad/estados-dictamen.enum';

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

export const MAPA_ESTADO_ARCHIVO_A_DOMINIO: Record<
  EstadoArchivoEvidencia,
  EstadosArchivoEvidencia
> = {
  [EstadoArchivoEvidencia.PENDIENTE]: EstadosArchivoEvidencia.PENDIENTE,
  [EstadoArchivoEvidencia.BORRADOR]: EstadosArchivoEvidencia.BORRADOR,
  [EstadoArchivoEvidencia.ENVIADO]: EstadosArchivoEvidencia.ENVIADO,
};

export const MAPA_ESTADO_ARCHIVO_A_PRISMA: Record<
  EstadosArchivoEvidencia,
  EstadoArchivoEvidencia
> = {
  [EstadosArchivoEvidencia.PENDIENTE]: EstadoArchivoEvidencia.PENDIENTE,
  [EstadosArchivoEvidencia.BORRADOR]: EstadoArchivoEvidencia.BORRADOR,
  [EstadosArchivoEvidencia.ENVIADO]: EstadoArchivoEvidencia.ENVIADO,
};

export const MAPA_ESTADO_DICTAMEN_A_DOMINIO: Record<
  EstadoDictamen,
  EstadosDictamen
> = {
  [EstadoDictamen.EN_REVISION]: EstadosDictamen.EN_REVISION,
  [EstadoDictamen.DEVUELTA_CON_OBSERVACIONES]:
    EstadosDictamen.DEVUELTA_CON_OBSERVACIONES,
  [EstadoDictamen.APROBADA]: EstadosDictamen.APROBADA,
};

export const MAPA_ESTADO_DICTAMEN_A_PRISMA: Record<
  EstadosDictamen,
  EstadoDictamen
> = {
  [EstadosDictamen.EN_REVISION]: EstadoDictamen.EN_REVISION,
  [EstadosDictamen.DEVUELTA_CON_OBSERVACIONES]:
    EstadoDictamen.DEVUELTA_CON_OBSERVACIONES,
  [EstadosDictamen.APROBADA]: EstadoDictamen.APROBADA,
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

export const traducirEstadoArchivoADominio = (
  estadoPrisma: EstadoArchivoEvidencia,
): EstadosArchivoEvidencia => {
  return MAPA_ESTADO_ARCHIVO_A_DOMINIO[estadoPrisma];
};

export const traducirEstadoArchivoAPrisma = (
  estadoDominio: EstadosArchivoEvidencia,
): EstadoArchivoEvidencia => {
  return MAPA_ESTADO_ARCHIVO_A_PRISMA[estadoDominio];
};

export const traducirEstadoDictamenADominio = (
  estadoPrisma: EstadoDictamen,
): EstadosDictamen => {
  return MAPA_ESTADO_DICTAMEN_A_DOMINIO[estadoPrisma];
};

export const traducirEstadoDictamenAPrisma = (
  estadoDominio: EstadosDictamen,
): EstadoDictamen => {
  return MAPA_ESTADO_DICTAMEN_A_PRISMA[estadoDominio];
};
