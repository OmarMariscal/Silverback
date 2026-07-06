import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginUserData {
  @ApiProperty({
    example: 'CONTRALOR',
    description: 'Rol del usuario loggeado',
  })
  rol!: string;

  @ApiProperty({
    example: 'uuid-cucei',
    description: 'UID del centro universitario',
  })
  centro_id!: string;
}
