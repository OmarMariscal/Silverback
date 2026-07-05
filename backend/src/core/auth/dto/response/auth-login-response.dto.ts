import { ApiProperty } from '@nestjs/swagger';
import { AuthLoginUserData } from './auth-login-user-data.dto';

export class AuthLoginResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...',
    description: 'JWT para el envío en los headders',
  })
  access_token!: string;

  @ApiProperty({
    description: 'Información básica del usuario autenticado.',
    type: () => AuthLoginUserData,
  })
  usuario!: AuthLoginUserData;
}
