import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../domain/roles/roles.enum';
import { ROLES_KEY } from '@core/decorators/roles.decorador';
import { Actor } from '../../domain/roles/actor.interface';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: Actor;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // 4. Tipamos la petición correctamente
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const actor = request.user;

    // 5. Validación de seguridad contra nulos/indefinidos
    if (!actor) {
      throw new UnauthorizedException(
        'No se encontró una sesión activa. Asegúrate de usar AuthGuard antes de RolesGuard.',
      );
    }

    // 1. Verificación natural: ¿El actor tiene el rol exacto que se pide?
    const tieneRolRequerido = requiredRoles.includes(actor.rol);

    // 2. Verificación por delegación: ¿El actor es auditor y el endpoint permite Contralores?
    const esAuditorDelegado =
      actor.rol === Roles.AUDITOR &&
      actor.tienePermisos === true &&
      requiredRoles.includes(Roles.CONTRALOR);

    if (tieneRolRequerido || esAuditorDelegado) {
      return true;
    }

    throw new ForbiddenException(
      'No tienes los permisos o el rol necesario para realizar esta acción.',
    );
  }
}
