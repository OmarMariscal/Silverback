import { Injectable } from '@nestjs/common';
import { ActividadesResumenResponse } from '../dto/response/actividades-resumen.response.dto';
import { ActividadesFichaTecnicaResponse } from '../dto/response/actividades-ficha-tecnica.response.dto';
import { ActividadesPatchFichaTecnicaRequest } from '../dto/request/actividades-path-ficha-tecnica.request.dto';
import { EliminacionCorrecta } from '@core/common/dto/response/deleted.response.dto';
import { PrismaService } from '@database/prisma.service';
import { Actor } from '@domain/roles/actor.interface';

@Injectable()
export class ActividadesService {
  constructor(private readonly prismaService: PrismaService) {}

  getResumen(actUuid: string): ActividadesResumenResponse {
    return new ActividadesResumenResponse();
  }

  getFichaTecnica(
    usuarioActual: Actor,
    actUuid: string,
  ): ActividadesFichaTecnicaResponse {
    console.log(usuarioActual);
    return new ActividadesFichaTecnicaResponse();
  }

  patchFichaTecnica(
    actUuid: string,
    fichaTecnica: ActividadesPatchFichaTecnicaRequest,
  ): ActividadesFichaTecnicaResponse {
    return new ActividadesFichaTecnicaResponse();
  }

  deleteActividad(actividadId: string): EliminacionCorrecta {
    return new EliminacionCorrecta();
  }
}
