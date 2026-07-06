import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // TODO: Implementar validación real con Passport/JWT cuando la BD esté lista.
    // MOCK: Por ahora, permitimos que Swagger y el Frontend pasen sin problemas.
    return true;
  }
}
