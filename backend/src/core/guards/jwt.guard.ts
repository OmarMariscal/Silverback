// src/core/guards/jwt.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Roles } from '@domain/roles/roles.enum';
import { Permisos } from '@domain/roles/permisos.enum';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { crearActor } from '@domain/roles/actor.factory';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // ==========================================
    // ESTRATEGIA MOCK (Solo activa en Desarrollo)
    // ==========================================
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const mockRole = request.headers['x-mock-role'];

    if (isDevelopment && mockRole) {
      const rolStr = mockRole.toString().toUpperCase() as Roles;
      const mockCentro =
        request.headers['x-mock-centro'] || 'uuid-centro-cucei';

      // Transformamos los permisos del header en un arreglo si es que existen
      const mockPermisosHeader = request.headers['x-mock-permisos'];
      let mockPermisos: Permisos[] = [];

      if (
        mockPermisosHeader &&
        mockPermisosHeader !== 'true' &&
        mockPermisosHeader !== 'false'
      ) {
        mockPermisos = mockPermisosHeader.toString().split(',') as Permisos[];
      }

      // 2. Utilizamos tu factory para obtener el rol y la lista de permisos unificada
      const datosActor = crearActor(rolStr, mockPermisos);

      const mockUserIdHeader = request.headers['x-mock-user-id']; // [1]

      // 3. Construimos el Payload Falso usando los datos del factory
      const mockPayload: JwtPayloadDto = {
        usuario_id: mockUserIdHeader
          ? mockUserIdHeader.toString()
          : `mock-user-${rolStr.toLowerCase()}`,
        rol: datosActor.rol, // Viene del factory
        permisos: datosActor.permisos, // ¡Viene del factory con los permisos por defecto!
        centro_id: rolStr === 'JEFA' ? null : mockCentro,
        perfil_id: `mock-perfil-${rolStr.toLowerCase()}`,
      };

      request.user = mockPayload;
      return true;
    }

    // ==========================================
    // ESTRATEGIA REAL (Para la siguiente iteración)
    // ==========================================
    /*
      const authHeader = request.headers.authorization;
      if (!authHeader) throw new UnauthorizedException('Token no proporcionado');
      
      try {
        const payload = this.jwtService.verify(authHeader.split(' ')[1]);
        request.user = payload;
        return true;
      } catch (e) {
        throw new UnauthorizedException('Token inválido o expirado');
      }
    */

    // Si no hay mock y la estrategia real aún no está implementada,
    // debemos fallar de forma segura y no otorgar acceso por defecto.
    throw new UnauthorizedException(
      'No se proporcionó un método de autenticación válido.',
    );
  }
}
