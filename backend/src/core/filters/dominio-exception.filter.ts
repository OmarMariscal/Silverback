import { ReglaNegocioException } from "@domain/excepciones/regla-negocio.exception";
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "@nestjs/common";

@Catch(ReglaNegocioException)
export class ReglaNegocioExceptionFilter implements ExceptionFilter{
    
}