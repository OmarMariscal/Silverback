import { Global, Module } from '@nestjs/common';
import { STORAGE_PORT_TOKEN } from '@core/interfaces/storage/storage-port.interface';
import { S3StorageAdapter } from './s3-storage.adapter';

@Global()
@Module({
  providers: [
    {
      provide: STORAGE_PORT_TOKEN,
      useClass: S3StorageAdapter,
    },
  ],
  exports: [STORAGE_PORT_TOKEN],
})
export class StorageModule {}
