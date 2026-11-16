import { EstadosDictamen } from './estados-dictamen.enum';

export class EntregaSubActividadEntity {
  constructor(
    private readonly id: string,
    private readonly subActividadId: string,
    private readonly version: number,
    private estadoDictamen: EstadosDictamen = EstadosDictamen.EN_REVISION,
    private readonly comentariosEntrega: string | null = null,
    private readonly fechaEnvio: Date = new Date(),
    private readonly fechaDictamen: Date | null = null,
  ) {}

  public getId(): string {
    return this.id;
  }

  public getSubActividadId(): string {
    return this.subActividadId;
  }

  public getVersion(): number {
    return this.version;
  }

  public getEstadoDictamen(): EstadosDictamen {
    return this.estadoDictamen;
  }

  public getComentariosEntrega(): string | null {
    return this.comentariosEntrega;
  }

  public getFechaEnvio(): Date {
    return this.fechaEnvio;
  }

  public getFechaDictamen(): Date | null {
    return this.fechaDictamen;
  }
}
