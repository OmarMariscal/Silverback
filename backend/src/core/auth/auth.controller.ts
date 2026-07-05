import { Controller, HttpStatus, HttpCode, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthLoginResponse } from './dto/response/auth-login-response.dto';
import { AuthLoginRequest } from './dto/request/auth-login-request.dto';
import { HttpErrorDto } from '../common/dto/response/http-error.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Iniciar Sesión',
    description: 'Obtener el JWT para las cookies del dispositivo',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Inicio de Sesión Exitoso',
    type: AuthLoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales Inválidas',
    type: HttpErrorDto,
  })
  @Post('login')
  login(
    @Body() loginDto: AuthLoginRequest,
  ): Promise<AuthLoginResponse> | AuthLoginResponse {
    return this.authService.login(loginDto);
  }
}
