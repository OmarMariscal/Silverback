import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Permisos } from '../../domain/roles/permisos.enum';
import { PERMISOS_KEY } from '@core/decorators/roles.decorador';
import { Actor } from '../../domain/roles/actor.interface';

interface AuthenticatedRequest extends Request {
  user?: Actor;
}

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermisos = this.reflector.getAllAndOverride<Permisos[]>(
      PERMISOS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si el endpoint no tiene el decorador, permitimos el paso por defecto.
    if (!requiredPermisos || requiredPermisos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const actor = request.user;

    // Validación defensiva
    if (!actor) {
      throw new UnauthorizedException(
        'No se encontró una sesión activa. Asegúrate de usar JwtGuard antes de PermisosGuard.',
      );
    }

    // Verificamos si el actor tiene AL MENOS UNO de los permisos requeridos por el endpoint.
    const tienePermiso = requiredPermisos.some((permiso) =>
      actor.permisos.includes(permiso),
    );

    if (tienePermiso) {
      return true;
    }

    throw new ForbiddenException(
      'No tienes los permisos necesarios para realizar esta acción.',
    );
  }
}
