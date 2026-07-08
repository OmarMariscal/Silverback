// src/core/decorators/usuario-actual.decorador.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';

export const UsuarioActual = createParamDecorator(
  (data: keyof JwtPayloadDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayloadDto;

    // Si pasaste un parámetro (ej. @UsuarioActual('rol')), te da solo ese string.
    // Si no pasaste nada (ej. @UsuarioActual()), te da todo el objeto.
    return data ? user?.[data] : user;
  },
);
