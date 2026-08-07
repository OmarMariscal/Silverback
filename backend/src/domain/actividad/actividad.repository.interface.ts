import { TransactionHandle } from '@domain/shared/transaction.interface';
import { ActividadEntity } from './actividad.entity';

export const ACTIVIDAD_REPOSITORY_TOKEN = Symbol('ACTIVIDAD_REPOSITORY_TOKEN');

export interface IActividadRepository {
  /**
   *Recupera el Agregado Raíz cfompleto (Actividad Padre + Subactividades Hijas)
   * Es indispensable para hidratar la Entidad en memotira antes de ejectuar
   * cualquier comando o regla de negocio.
   *
   * @param id IIdentificador único de la Actividad
   * @returns La entidad hidratada o null si no existe
   */
  obtenerPorId(id: string): Promise<ActividadEntity | null>;

  /**
   * Recupera el Agregado Raíz completo (Actividad Padre + Subactividades Hijas)
   * De todas las relacionadas ocn un POA especíofico.
   *
   * @param id Identificaddor único de la Actividad
   * @returns Array con las as entidades que pertenencen a la POA
   */
  obtenerPorPoaId(id: string): Promise<ActividadEntity[]>;

  /**
   * Persiste el estado actual del Agregado Raíz completo
   *
   * Actúa como un "Upsert" a nivel de dominio: Si la entidad es nueva, la crea.
   * Si ya existe, actualiza al padre y sincroniza automáticamente las
   * sub-actividades hijas modificadas.
   *
   * Utiliza como opcional transaction Handle para que su guardado sea consistente y seguro
   * junto con su poa de origin (y su respectiva entidad)
   *
   * @param actividad La entidad con las reglas de negocio ya validadas
   */
  guardar(actividad: ActividadEntity, tx?: TransactionHandle): Promise<void>;

  /**
   * Ejecuta la eliminación (física o lógica, según lo decida la infraestructura)
   * del agregado completo, garantizando quye no queden sub-actividades huérfanas.
   *
   * @param id Identificador único de la Actividad
   */
  eliminar(id: string): Promise<void>;
}
