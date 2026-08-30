import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginacionQueryDto } from '@core/common/dto/request/paginacion.query.dto';
import { ActividadesSortColumn } from '../../enums/actividades-sort-column.enum';
import { IsOptional, IsEnum, IsString, IsUUID } from 'class-validator';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { EstadosSemaforo } from '@domain/semaforo/estados-semaforo-enum';

export class SubActividadesDirectorioQueryDto extends PaginacionQueryDto {
  @ApiPropertyOptional({
    enum: ActividadesSortColumn,
    default: ActividadesSortColumn.FECHA_TERMINO,
  })
  @IsOptional()
  @IsEnum(ActividadesSortColumn)
  sort_by?: ActividadesSortColumn = ActividadesSortColumn.FECHA_TERMINO;

  @ApiPropertyOptional({
    description: 'Búsqueda libre por texto o identificador',
    example: 'Auditoria 055',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Identificador único (UUID) del centro universitario',
    example: 'centro-uuid-1',
  })
  @IsOptional()
  @IsUUID('4')
  centro_uuid?: string;

  @ApiPropertyOptional({
    description: 'Tipo de actividad asingado',
    enum: TipoSubActividad,
    example: TipoSubActividad.AUDITORIA,
  })
  @IsOptional()
  @IsEnum(TipoSubActividad)
  tipo_actividad?: TipoSubActividad;

  @ApiPropertyOptional({
    description: 'Estado de la sub-actividad',
    enum: EstadosActividades,
    example: EstadosActividades.EN_PROGRESO,
  })
  @IsOptional()
  @IsEnum(EstadosActividades)
  estado_flujo?: EstadosActividades;

  @ApiPropertyOptional({
    description: 'Estado del semáforo calculado por vencimiento',
    enum: EstadosSemaforo,
  })
  @IsOptional()
  @IsEnum(EstadosSemaforo)
  semaforo?: EstadosSemaforo;
}
