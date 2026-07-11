import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { ActividadesModule } from './modules/actividades/actividades.module';
import { PoasModule } from './modules/poas/poas.module';
import { CatalogoModule } from './modules/catalogo/catalogo.module';
import { AuditoresModule } from './modules/auditores/auditores.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
    }),
    AuthModule,
    ActividadesModule,
    PoasModule,
    CatalogoModule,
    AuditoresModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
