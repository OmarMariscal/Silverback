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

      // Transformamos el header en un arreglo de Permisos
      const mockPermisosHeader = request.headers['x-mock-permisos'];
      let mockPermisos: Permisos[] = [];

      if (mockPermisosHeader) {
        const headerValue = mockPermisosHeader.toString();
        // Evitamos romper si por inercia se envía 'true' o 'false' en las pruebas
        if (headerValue !== 'true' && headerValue !== 'false') {
          // Si envían "PRESENTAR_POA,CREAR_POA", lo dividimos en un array
          mockPermisos = headerValue.split(',') as Permisos[];
        }
      }

      // Creamos el Payload Falso simulando lo que tendría un JWT
      const mockPayload: JwtPayloadDto = {
        usuario_id: `mock-user-${rolStr.toLowerCase()}`,
        rol: rolStr,
        centro_id: rolStr === 'JEFA' ? null : mockCentro,
        perfil_id: `mock-perfil-${rolStr.toLowerCase()}`,
        permisos_especiales: mockPermisos,
      };

      // Inyectamos el usuario en la Request de Express
      request.user = mockPayload;
      return true; // Acceso concedido
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
