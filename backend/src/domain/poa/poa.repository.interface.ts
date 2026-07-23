import { PoaEntity } from './poa.entity';

export const POA_REPOSITORY_TOKEN = Symbol('POA_REPOSITORY_TOKEN');

export interface IPoaRepository {
  /**
   * Recupera el Agregado Raíz POA (Solo metadatos del POA, sin hidratar
   * el árbol profundo de Actividades para proteger el rendimiento y la memoria).
   * Es indispensable para hidratar la Entidad antes de ejecutar
   * cualquier comando (ej. Aprobar POA, Rechazar POA).
   *
   * @param id Identificador único del POA
   * @returns La entidad hidratada o null si no existe
   */
  obtenerPorId(id: string): Promise<PoaEntity | null>;

  /**
   * Persiste el estado actual del Agregado Raíz POA.
   *
   * Actúa como un "Upsert" a nivel de dominio.
   *
   * @param poa La entidad con las reglas de negocio ya validadas
   */
  guardar(poa: PoaEntity): Promise<void>;

  /**
   * Ejecuta la eliminación (física o lógica) del POA.
   * Las reglas de integridad referencial (ej. si tiene actividades
   * no se puede borrar) se validarán en el Dominio antes de llamar a este método.
   *
   * @param id Identificador único del POA
   */
  eliminar(id: string): Promise<void>;
}
