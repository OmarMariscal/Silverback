import { ApiProperty } from '@nestjs/swagger';

export class HeadersRequeridosDto {
  @ApiProperty({
    description:
      'El valor exacto del mime_type declarado (ej. application/pdf). No usar multipart/form-data.',
    example: 'application/pdf',
  })
  'Content-Type': string;
}
