import { ApiProperty } from '@nestjs/swagger';
import { HeadersRequeridosDto } from './headers-requeridos.dto';

export class GenerarPreFirmaResponseDto {
  @ApiProperty({
    description:
      'UUID único generado para el registro de la evidencia en estado PENDIENTE',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  archivo_id!: string;

  @ApiProperty({
    description:
      'URL pre-firmada PUT para la transmisión directa del binario crudo hacia el almacenamiento S3/SeaweedFS',
    example:
      'https://midominio-storage.s3.amazonaws.com/poa/subactividades/sub-act-uuid/uuid-generado.pdf?X-Amz-Algorithm=...',
  })
  upload_url!: string;

  @ApiProperty({
    description: 'Método HTTP estricto que debe emplear el cliente en el PUT',
    example: 'PUT',
  })
  metodo_http!: string;

  @ApiProperty({
    description: 'Tiempo de vida de la firma temporal en segundos',
    example: 300,
  })
  expira_en_segundos!: number;

  @ApiProperty({
    description:
      'Cabeceras HTTP obligatorias que debe configurar el cliente HTTP (Axios/Fetch)',
    type: HeadersRequeridosDto,
  })
  headers_requeridos!: HeadersRequeridosDto;
}
