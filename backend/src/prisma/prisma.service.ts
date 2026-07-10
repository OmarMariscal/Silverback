import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ adapter });
  }
  async onModuleInit() {
    // Se conecta a PostgreSQL en cuanto arranca el backend
    await this.$connect();
  }

  async onModuleDestroy() {
    // Cierra la conexión limpiamente si el servidor se apaga
    await this.$disconnect();
  }
}
