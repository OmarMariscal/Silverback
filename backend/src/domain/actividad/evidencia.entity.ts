import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';
import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';
import { EstadosArchivoEvidencia } from './estados-archivo-evidencia.enum';
import { MAX_PESO_ARCHIVO_BYTES } from './utils/reglas-archivo.util';

export class EvidenciaEntity {
  constructor(
    private readonly id: string,
    private readonly subActividadId: string,
    private entregaId: string | null,
    private nombreOriginal: string,
    private readonly objectKey: string,
    private pesoBytes: number,
    private readonly tipoMime: string,
    private estado: EstadosArchivoEvidencia = EstadosArchivoEvidencia.PENDIENTE,
    private readonly fechaCreacion: Date = new Date(),
  ) {}

  public getId(): string {
    return this.id;
  }

  public getSubActividadId(): string {
    return this.subActividadId;
  }

  public getEntregaId(): string | null {
    return this.entregaId;
  }

  public getNombreOriginal(): string {
    return this.nombreOriginal;
  }

  public getObjectKey(): string {
    return this.objectKey;
  }

  public getPesoBytes(): number {
    return this.pesoBytes;
  }

  public getPesoMb(): number {
    return (Math.round(this.pesoBytes / (1024 * 1024)) * 100) / 100;
  }

  public getTipoMime(): string {
    return this.tipoMime;
  }

  public getEstado(): EstadosArchivoEvidencia {
    return this.estado;
  }

  public getFechaCreacion(): Date {
    return this.fechaCreacion;
  }

  /**
   * Transiciona el archivo de PENDIENTE a BORRADOR verificando integridad de peso físico
   */
  public confirmarCarga(pesoFisicoBytes?: number): void {
    if (this.estado === EstadosArchivoEvidencia.BORRADOR) {
      return; // Operación odempotente si el cliente reintenta la confirmación
    }

    if (this.estado !== EstadosArchivoEvidencia.PENDIENTE) {
      throw new ReglaNegocioException(
        `No se puede confirmar un archivo en estado ${this.estado}. Se requiere estado ${EstadosArchivoEvidencia.PENDIENTE}`,
        CodigoDeViolacion.ESTADO_INVALIDO,
      );
    }

    if (pesoFisicoBytes !== undefined) {
      if (pesoFisicoBytes <= 0 || pesoFisicoBytes > MAX_PESO_ARCHIVO_BYTES) {
        throw new ReglaNegocioException(
          `El archivo subido tiene un peso inválido (${pesoFisicoBytes}). El límite es 50MB. `,
          CodigoDeViolacion.ARCHIVO_INVALIDO,
        );
      }

      if (pesoFisicoBytes !== this.pesoBytes) {
        throw new ReglaNegocioException(
          `El peso físico del archivo subido (${pesoFisicoBytes}) no coincide con el peso declarado en la pre-firma (${this.pesoBytes} bytes).`,
          CodigoDeViolacion.ARCHIVO_INVALIDO,
        );
      }
    }

    this.estado = EstadosArchivoEvidencia.BORRADOR;
  }

  /**
   * Consolida el archivo dentro de una EntregaSubActividad inmutable.
   */
  public consolidarEnEntrega(entregaId: string): void {
    if (this.estado !== EstadosArchivoEvidencia.BORRADOR) {
      throw new ReglaNegocioException(
        `El archivo '${this.nombreOriginal}' debe estar confirmado en estado ${EstadosArchivoEvidencia.BORRADOR} antes de enviarse a revisión (actual: ${this.estado})`,
        CodigoDeViolacion.ESTADO_INVALIDO,
      );
    }

    this.entregaId = entregaId;
    this.estado = EstadosArchivoEvidencia.ENVIADO;
  }

  /**
   * Protege la trazabilidad histórica: un archivo ENVIADO es inmutable y no puede eliminarse
   */
  public validarEliminacion(): void {
    if (this.estado === EstadosArchivoEvidencia.ENVIADO) {
      throw new ReglaNegocioException(
        `El archivo '${this.nombreOriginal}' ya forma parte de una entrega histórica enviada a revisión y es inmutable.`,
        CodigoDeViolacion.ESTADO_INVALIDO,
      );
    }
  }
}
