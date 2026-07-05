import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PoasModule } from './modules/poas/poas.module';
import { CatalogoModule } from './modules/catalogo/catalogo.module';
import { AuditoresModule } from './modules/auditores/auditores.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [PoasModule, CatalogoModule, AuditoresModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
