import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorDto {
  @ApiProperty({ description: 'Código de estado HTTP', example: 401 })
  statusCode!: number;

  @ApiProperty({
    description: 'Mensaje descriptivo del error',
    example: 'Credenciales inválidas',
  })
  message!: string | string[];

  @ApiProperty({ description: 'Tipo de error HTTP', example: 'Unauthorized' })
  error!: string;
}
