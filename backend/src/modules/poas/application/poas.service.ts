import { Inject, Injectable } from '@nestjs/common';
import type { IPoaRepository } from '@domain/poa/poa.repository.interface';
import { POA_REPOSITORY_TOKEN } from '@domain/poa/poa.repository.interface';
import type { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';

@Injectable()
export class PoasService {
  constructor(
    @Inject(POA_REPOSITORY_TOKEN)
    private readonly poaRepository: IPoaRepository,
    @Inject(ACTIVIDAD_REPOSITORY_TOKEN)
    private readonly actividadRepository: IActividadRepository,
  ) {}
}
