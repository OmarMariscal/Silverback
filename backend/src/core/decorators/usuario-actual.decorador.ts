import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsuarioActual = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Accedemos a la petición (request) HTTP cruda
    const request = ctx.switchToHttp().getRequest();

    // ESTRATEGIA DE SIMULACIÓN PARA PARALELIZAR:
    // Buscamos si el Frontend nos mandó un header especial de prueba
    const xMockRole = request.headers['x-mock-role']; // Puede ser 'JEFA' o 'CONTRALOR'
    const xMockCentro = request.headers['x-mock-centro'] || 'uuid-cucei';

    // Si el Frontend nos está pidiendo explícitamente simular un rol:
    if (xMockRole) {
      const rolFormateado = xMockRole.toString().toUpperCase();
      return {
        rol: rolFormateado,
        centro_id: rolFormateado === 'JEFA' ? null : xMockCentro,
      };
    }

    // Caso por defecto: Si el Frontend no manda ningún header,
    // el sistema asume que es el Contralor de CUCEI para no romper las pruebas básicas.
    return {
      rol: 'CONTRALOR',
      centro_id: 'uuid-cucei',
    };
  },
);
