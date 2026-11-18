import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { ActividadesModule } from './modules/actividades/actividades.module';
import { PoasModule } from './modules/poas/poas.module';
import { CatalogoModule } from './modules/catalogo/catalogo.module';
import { AuditoresModule } from './modules/auditores/auditores.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CentrosModule } from './modules/centros/centros.module';
import { StorageModule } from '@storage/storage.module';
import { GarbageCollectorModule } from './modules/garbage-collector/garbage-collector.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
    }),
    ScheduleModule.forRoot(), // [TASK-07] Habilitar programación de tareas cron
    StorageModule,
    AuthModule,
    ActividadesModule,
    PoasModule,
    CatalogoModule,
    AuditoresModule,
    DashboardModule,
    CentrosModule,
    GarbageCollectorModule, // [TASK-07] Módulo de recolección de archivos huérfanos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
