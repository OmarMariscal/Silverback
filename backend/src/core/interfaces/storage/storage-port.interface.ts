import { GenerarPreFirmaDescargaParams } from './generar-prefirma-descarga-params.interface';
import { GenerarPreFirmaSubidaParams } from './generar-prefirma-subida-params.interface';
import { MetadataObjetoStorage } from './metadata-objeto-storage.interface';
import { PreFirmaSubidaResult } from './prefirma-subida-result.interface';

export const STORAGE_PORT_TOKEN = Symbol('STORAGE_PORT_TOKEN');

export interface IStoragePort {
  /**
   * Genera una URL pre-firmada temporal (PUT) para subida directa desde el cliente web
   */
  generarUrlPreFirmadaSubida(
    params: GenerarPreFirmaSubidaParams,
  ): Promise<PreFirmaSubidaResult>;

  /**
   * Genera una URL pre-firma temporal (GET) para lectura o descarga segura con Content-Disposition.
   */
  generarUrlPreFirmadaDescarga(
    params: GenerarPreFirmaDescargaParams,
  ): Promise<string>;

  /**
   * Verifica la existencia física y metadatos reales (peso y MIME) de un objeto en el almacenamiento
   */
  verificarExistenciaObjeto(objectKey: string): Promise<MetadataObjetoStorage>;

  /**
   * Elimina físicamente un objeto del almacenamiento
   */
  eliminarObjeto(objectKey: string): Promise<void>;

  /**
   * Elimina múltiples objetos en una sola operación en lote
   */
  eliminarObjetosEnLote(objectKeys: string[]): Promise<void>;
}
