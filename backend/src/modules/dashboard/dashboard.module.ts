import { Module } from '@nestjs/common';
import { DashboardService } from './application/dashboard.service';
import { DashboardController } from './infrastructure/http/dashboard.controller';
import { PrismaDashboardQueryRepository } from './infrastructure/repositories/prisma-dashboard-query.repository';
import { DASHBOARD_QUERY_REPOSITORY_TOKEN } from './application/ports/dashboard-query.repository.interface';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    {
      provide: DASHBOARD_QUERY_REPOSITORY_TOKEN,
      useClass: PrismaDashboardQueryRepository,
    },
  ],
})
export class DashboardModule {}