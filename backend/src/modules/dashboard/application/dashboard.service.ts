import { Injectable, Inject } from '@nestjs/common';
import * as dashboardQueryRepositoryInterface from './ports/dashboard-query.repository.interface';

// Importamos los DTOs (Lo que sale al exterior)
import { DashboardDto } from '../dto/response/dashboard.dto';
import { DashboardJefaDto } from '../dto/response/dashboard-jefa.dto';
import { RezagoDataDto } from '../dto/response/dashboard-rezago-data.dto';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(dashboardQueryRepositoryInterface.DASHBOARD_QUERY_REPOSITORY_TOKEN)
    private readonly dashboardQueryRepo: dashboardQueryRepositoryInterface.IDashboardQueryRepository,
  ) {}

  public async getDashboardContralor(contralorId: string): Promise<DashboardDto> {
    // 1. Obtenemos el resultado puro (Capa de Aplicación)
    const result = await this.dashboardQueryRepo.obtenerKpisContralor(contralorId);
    
    // 2. Mapeamos al DTO (Capa de Transporte/Red)
    return result as DashboardDto; 
  }

  public async getDashboardJefa(): Promise<DashboardJefaDto> {
    const result = await this.dashboardQueryRepo.obtenerKpisJefa();
    return result as DashboardJefaDto;
  }

  public async getRezagoCentros(): Promise<RezagoDataDto> {
    const result = await this.dashboardQueryRepo.obtenerCentrosConRezago();
    return result as RezagoDataDto;
  }
}