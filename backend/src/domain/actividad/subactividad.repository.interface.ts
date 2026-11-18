import { TransactionHandle } from '@domain/shared/transaction.interface';
import { SubactividadEntity } from './subactividad.entity';
import { EvidenciaEntity } from './evidencia.entity';
import { EntregaSubActividadEntity } from './entrega-subactividad.entity';
import { EstadosArchivoEvidencia } from './estados-archivo-evidencia.enum';

export const SUBACTIVIDAD_REPOSITORY_TOKEN = Symbol(
  'SUBACTIVIDAD_REPOSITORY_TOKEN',
);

export interface ISubactividadRepository {
  /**
   * Recupera la SubActividad hidratada con su contexto de ejecución (POA, Centro, Contralor, Jefa, Auditores y última versión).
   */
  obtenerPorIdConContexto(
    id: string,
    tx?: TransactionHandle,
  ): Promise<SubactividadEntity | null>;

  /**
   * Obtiene una evidencia específica por su UUID.
   */
  obtenerEvidenciaPorId(
    archivoId: string,
    tx?: TransactionHandle,
  ): Promise<EvidenciaEntity | null>;

  /**
   * Obtiene las evidencias de una subactividad filtradas por su estado (ej. BORRADOR).
   */
  obtenerEvidenciasPorEstado(
    subActividadId: string,
    estado: EstadosArchivoEvidencia,
    tx?: TransactionHandle,
  ): Promise<EvidenciaEntity[]>;

  /**
   * Crea o actualiza un registro de Evidencia (PENDIENTE o BORRADOR).
   */
  guardarEvidencia(
    evidencia: EvidenciaEntity,
    tx?: TransactionHandle,
  ): Promise<void>;

  /**
   * Elimina un registro de Evidencia de la base de datos.
   */
  eliminarEvidencia(archivoId: string, tx?: TransactionHandle): Promise<void>;

  /**
   * Elimina múltiples registros de Evidencia por sus UUIDs.
   */
  eliminarEvidenciasPorIds(
    archivosIds: string[],
    tx?: TransactionHandle,
  ): Promise<void>;

  /**
   * Persiste atómicamente la nueva EntregaSubActividad, actualiza las evidencias a ENVIADO
   * y actualiza el estado_operativo y fecha_envio de la SubActividad.
   */
  registrarEntregaYActualizarSubActividad(
    subActividad: SubactividadEntity,
    entrega: EntregaSubActividadEntity,
    evidenciasConsolidadas: EvidenciaEntity[],
    tx?: TransactionHandle,
  ): Promise<void>;
}
