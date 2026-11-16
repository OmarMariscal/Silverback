import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';
import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';
import { ValidacionIntegridadException } from '@domain/excepciones/validacion-integridad.exception';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(
  ReglaNegocioException,
  ValidacionIntegridadException,
  RecursoNoEncontradoException,
)
export class DominioExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | ReglaNegocioException
      | ValidacionIntegridadException
      | RecursoNoEncontradoException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Manejo del caso específico del 404 antes del 400
    if (exception instanceof RecursoNoEncontradoException) {
      const status = HttpStatus.NOT_FOUND;
      return response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: 'Not Found',
      });
    }

    if (exception instanceof ValidacionIntegridadException) {
      const status = HttpStatus.BAD_REQUEST;
      return response.status(status).json({
        statusCode: status,
        message: exception.message,
        errores: exception.Errores,
      });
    }

    if (exception instanceof ReglaNegocioException) {
      const esViolacionAutorizacion =
        exception.codigoViolado === CodigoDeViolacion.ROL_INVALIDO ||
        exception.codigoViolado === CodigoDeViolacion.ACCESO_DENEGADO;

      const status = esViolacionAutorizacion
        ? HttpStatus.FORBIDDEN
        : HttpStatus.BAD_REQUEST;

      return response.status(status).json({
        statusCode: status,
        message: exception.message,
        violationCode: exception.codigoViolado,
      });
    }
  }
}
