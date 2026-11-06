import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

//Únicamente cachamos las excepciones de Prisma
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  constructor(httpAdapter?: AbstractHttpAdapter) {
    super(httpAdapter);
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const meta = exception.meta;
    const targetField =
      meta && typeof meta === 'object' && 'target' in meta
        ? Array.isArray(meta.target)
          ? (meta.target as string[]).join(', ')
          : String(meta.target)
        : 'desconocido';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno de la base de datos.';
    let errorType = 'Internal Server Error';

    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = `El registro ya existe. Conflicto en el campo: ${targetField}`;
        errorType = 'Conflict';
        break;

      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'El registro solicitado no existe en la base de datos.';
        errorType = 'Not Found';
        break;

      case 'P2003':
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        message =
          'El registro hace referencia a un dato que no existe (Error de llave foránea).';
        errorType = 'Unprocessable Entity';
        break;

      case 'P2014':
        statusCode = HttpStatus.CONFLICT;
        message =
          'No se puede eliminar el registro porque tiene datos relacionados activos.';
        errorType = 'Conflict';
        break;

      default:
        console.error(
          `[PrismaFilter] Código no manejado: ${exception.code}`,
          exception.message,
        );
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Error interno del servidor. Contacte al administrador.';
        errorType = 'Internal Server Error';
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: errorType,
    });
  }
}
