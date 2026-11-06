import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IUnitOfWork } from '@core/interfaces/unit-of-work.interface';
import { TransactionHandle } from '@domain/shared/transaction.interface';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutarTransaccion<T>(
    trabajo: (tx: TransactionHandle) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction((tx) => trabajo(tx));
  }
}
