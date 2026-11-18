// [TASK-06] DTO de respuesta para GET /api/v1/sub-actividades/:id/historial
import { ApiProperty } from '@nestjs/swagger';

export class HistorialIndexItemDto {
  @ApiProperty() id_version: string;
  @ApiProperty() numero_version: number;
  @ApiProperty() titulo_evento: string;
  @ApiProperty() estado: string;
  @ApiProperty() fecha_evento: string;
}

export class HistorialIndexResponseDto {
  @ApiProperty({ type: [HistorialIndexItemDto] }) data: HistorialIndexItemDto[];
}

export class EvidenciaVersionDto {
  @ApiProperty() id: string;
  @ApiProperty() nombre: string;
  @ApiProperty() peso_formateado: string;
  @ApiProperty() fecha_subida: string;
}

export class ObservacionVersionDto {
  @ApiProperty() id: string;
  @ApiProperty() numero: number;
  @ApiProperty() texto: string;
}

export class VersionDetalleResponseDto {
  @ApiProperty() folio: string;
  @ApiProperty() centro_clave: string;
  @ApiProperty() titulo_subactividad: string;
  @ApiProperty() version_visualizada: number;
  @ApiProperty() es_version_actual: boolean;
  @ApiProperty() fecha_envio_contralor: string;
  @ApiProperty({ nullable: true }) mensaje_envio: string | null;
  @ApiProperty({ type: [EvidenciaVersionDto] }) evidencias: EvidenciaVersionDto[];
  @ApiProperty({ nullable: true }) resolucion_estado: string | null;
  @ApiProperty({ nullable: true }) fecha_dictamen: string | null;
  @ApiProperty({ type: [ObservacionVersionDto] }) observaciones: ObservacionVersionDto[];
}

export class LinkDescargaResponseDto {
  @ApiProperty() url_descarga_efimera: string;
}
