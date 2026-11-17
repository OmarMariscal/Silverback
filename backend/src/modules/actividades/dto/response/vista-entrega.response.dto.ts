// [TASK-04] DTO de respuesta para GET /api/v1/sub-actividades/:id/vista-entrega
import { ApiProperty } from '@nestjs/swagger';

export class MetaCabeceraDto {
  @ApiProperty() folio: string;
  @ApiProperty() titulo: string;
  @ApiProperty() centro_clave: string;
  @ApiProperty() version_actual: number;
  @ApiProperty() etiqueta_semaforo: string;
  @ApiProperty() permite_entrega: boolean;
  @ApiProperty({ description: 'Indica si se permite carga de evidencias en este estado y año fiscal' }) permite_carga_evidencias: boolean;
}

export class ObservacionActivaDto {
  @ApiProperty() id: string;
  @ApiProperty() correlativo: string;
  @ApiProperty() estado: string;
  @ApiProperty() descripcion: string;
}

export class EvidenciaBorradorDto {
  @ApiProperty() id: string;
  @ApiProperty() nombre_archivo: string;
  @ApiProperty() peso_mb: number;
  @ApiProperty() url_descarga: string;
}

export class PeriodoEjecucionDto {
  @ApiProperty() inicio: string;
  @ApiProperty() fin: string;
}

export class DetallesOperacionDto {
  @ApiProperty() estado_actual: string;
  @ApiProperty({ type: PeriodoEjecucionDto }) periodo_ejecucion: PeriodoEjecucionDto;
  @ApiProperty() duracion_estimada_semanas: number;
  @ApiProperty({ nullable: true }) cierre_global_poa: string | null;
}

export class BuzonBorradorDto {
  @ApiProperty({ type: [EvidenciaBorradorDto] }) evidencias: EvidenciaBorradorDto[];
  @ApiProperty({ nullable: true }) comentarios_entrega: string | null;
}

export class HistorialVersionDto {
  @ApiProperty() id: string;
  @ApiProperty() estado_operativo: string;
  @ApiProperty() etiqueta: string;
  @ApiProperty() fecha: string;
  @ApiProperty() es_version_actual: boolean;
  @ApiProperty() tiene_observaciones: boolean;
  @ApiProperty({ required: false }) tiene_archivos_subidos?: boolean;
}

export class VistaEntregaResponseDto {
  @ApiProperty({ type: MetaCabeceraDto }) meta_cabecera: MetaCabeceraDto;
  @ApiProperty({ type: [ObservacionActivaDto] }) observaciones_activas: ObservacionActivaDto[];
  @ApiProperty({ type: DetallesOperacionDto }) detalles_operacion: DetallesOperacionDto;
  @ApiProperty({ type: BuzonBorradorDto }) buzon_borrador: BuzonBorradorDto;
  @ApiProperty({ type: [HistorialVersionDto] }) historial_versiones: HistorialVersionDto[];
}
