import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class AuthLoginRequest {
  @ApiProperty({
    example: 'monkeycodeinc@gmail.com',
    description: 'Correo electrónico previamente registrado',
  })
  @IsNotEmpty()
  @IsEmail()
  correo!: string;

  @ApiProperty({
    example: 'Admin123!',
    description: 'Contraseña de acceso',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
