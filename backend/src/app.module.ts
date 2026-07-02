import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { ActividadesModule } from './modules/actividades/actividades.module';

@Module({
  imports: [AuthModule, ActividadesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
