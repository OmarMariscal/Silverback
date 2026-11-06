import { Actor } from '@domain/roles/actor.interface';
import { JwtPayloadDto } from '@core/auth/dto/jwt-payload.dto';

export interface SesionUsuario extends JwtPayloadDto {
  actor: Actor;
}
