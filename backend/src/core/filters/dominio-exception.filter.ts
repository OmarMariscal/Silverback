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

    //Manejo del caso específico del 404 antes del 400
    if (exception instanceof RecursoNoEncontradoException) {
      const status = HttpStatus.NOT_FOUND;
      return response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: 'Not Found',
      });
    }

    const status = HttpStatus.BAD_REQUEST;
    const message = exception.message;

    if (exception instanceof ValidacionIntegridadException) {
      response.status(status).json({
        statusCode: status,
        message: message,
        errores: exception.Errores,
      });
    } else if (exception instanceof ReglaNegocioException) {
      response.status(status).json({
        statusCode: status,
        message: message,
        violationCode: exception.codigoViolado,
      });
    }
  }
}
