// src/core/decorators/usuario-actual.decorador.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { crearActor } from '@domain/roles/actor.factory';
import { SesionUsuario } from '../interfaces/sesion-usuario.interface';

export const UsuarioActual = createParamDecorator(
  (data: keyof SesionUsuario | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const jwtPayload = request.user as JwtPayloadDto;

    // Si por alguna razón el Guard no inyectó el user (ej. endpoint público), retornamos null
    if (!jwtPayload) return null;

    // 1. Construimos el Actor de Dominio usando tu Factory
    const actorDominio = crearActor(
      jwtPayload.rol,
      jwtPayload.permisos_especiales,
    );

    // 2. Armamos el objeto rico de Sesión
    const sesionCompleta: SesionUsuario = {
      ...jwtPayload,
      actor: actorDominio,
    };

    // 3. Retornamos la propiedad solicitada o el objeto completo
    return data ? sesionCompleta[data] : sesionCompleta;
  },
);
