import { TransactionHandle } from '@domain/shared/transaction.interface';

export const UNIT_OF_WORK_TOKEN = Symbol('UNIT_OF_WORK_TOKEN');

export interface IUnitOfWork {
  ejecutarTransaccion<T>(
    trabajo: (tx: TransactionHandle) => Promise<T>,
  ): Promise<T>;
}
