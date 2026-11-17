import {
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GenerarPreFirmaDescargaParams } from '@core/interfaces/storage/generar-prefirma-descarga-params.interface';
import { GenerarPreFirmaSubidaParams } from '@core/interfaces/storage/generar-prefirma-subida-params.interface';
import { MetadataObjetoStorage } from '@core/interfaces/storage/metadata-objeto-storage.interface';
import { PreFirmaSubidaResult } from '@core/interfaces/storage/prefirma-subida-result.interface';
import { IStoragePort } from '@core/interfaces/storage/storage-port.interface';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3StorageAdapter
  implements IStoragePort, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(S3StorageAdapter.name);
  private readonly internalClient: S3Client;
  private readonly publicSignerClient: S3Client;
  private readonly bucketName: string;
  private readonly defaultExpirationSeconds = 300;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('S3_REGION', 'us-east-1');
    const accessKeyId =
      this.configService.get<string>('S3_ACCESS_KEY') ??
      this.configService.get<string>('AWS_ACCESS_KEY_ID', 'minio_dev_user');
    const secretAccessKey =
      this.configService.get<string>('S3_SECRET_KEY') ??
      this.configService.get<string>(
        'AWS_SECRET_ACCESS_KEY',
        'minio_dev_passowrd',
      );

    this.bucketName = this.configService.get<string>(
      'S3_BUCKET_NAME',
      'silverback-evidencias',
    );

    const internalEndpoint = this.configService.get<string>('S3_ENDPOINT');
    const publicEndpoint =
      this.configService.get<string>('S3_PUBLIC_ENDPOINT') ?? internalEndpoint;

    const forcePathStyle =
      this.configService.get<string>('S3_FORCE_PATH_STYLE', 'true') == 'true';

    const baseConfig: S3ClientConfig = {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle,
      // Evita que AWS SDK v3 inyecte headers CRC32 que rompen el PUT de binarios crudos desde el navegador
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    };

    // 1. Cliente interno: Comunicaci'on contenedor-a-contenedor (http://s3_storage:8333) o AWS S3 en producción
    this.internalClient = new S3Client({
      ...baseConfig,
      ...(internalEndpoint ? { endpoint: internalEndpoint } : {}),
    });

    // 2. Cliente firmador público: Firma criptográfica SigV3 con el Host visible para el navegador (http://localhost:9000)
    this.publicSignerClient = new S3Client({
      ...baseConfig,
      ...(publicEndpoint ? { endpoint: publicEndpoint } : {}),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.asegurarBucketYCors();
  }

  onModuleDestroy(): void {
    this.internalClient.destroy();
    this.publicSignerClient.destroy();
  }

  private async asegurarBucketYCors(): Promise<void> {
    try {
      await this.internalClient.send(
        new HeadBucketCommand({ Bucket: this.bucketName }),
      );
      this.logger.log(
        `Bucket S3 '${this.bucketName}' verificado correctamente.`,
      );
    } catch {
      this.logger.warn(
        `El bucket '${this.bucketName}' no existe aún. Creándolo automáticamente...`,
      );
      try {
        await this.internalClient.send(
          new CreateBucketCommand({ Bucket: this.bucketName }),
        );
        this.logger.log(`Bucket '${this.bucketName}' creado con éxito.`);
      } catch (createError) {
        this.logger.error(
          `No se pudo verificar ni crear el bucket '${this.bucketName}'. Verifica la conexión con SeaweedFS/S3.`,
          createError,
        );
        return;
      }
    }

    try {
      const allowedOriginsRaw = this.configService.get<string>(
        'S3_CORS_ALLOWED_ORIGINS',
        '*',
      );
      const allowedOrigins = allowedOriginsRaw.split(',').map((o) => o.trim());

      await this.internalClient.send(
        new PutBucketCorsCommand({
          Bucket: this.bucketName,
          CORSConfiguration: {
            CORSRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'HEAD', 'DELETE'],
                AllowedOrigins: allowedOrigins,
                ExposeHeaders: ['ETag'],
                MaxAgeSeconds: 3600,
              },
            ],
          },
        }),
      );
      this.logger.log(
        `Reglas CORS aplicadas exitosamente en el bucket '${this.bucketName}'.`,
      );
    } catch {
      this.logger.debug(
        `PutBucketCors omitido o gestionado estáticamente por el servidor S3 para '${this.bucketName}'.`,
      );
    }
  }

  async generarUrlPreFirmadaSubida(
    params: GenerarPreFirmaSubidaParams,
  ): Promise<PreFirmaSubidaResult> {
    const expiraEnSegundos =
      params.expiraEnSegundos ?? this.defaultExpirationSeconds;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: params.objectKey,
      ContentType: params.mimeType,
    });

    const uploadUrl = await getSignedUrl(this.publicSignerClient, command, {
      expiresIn: expiraEnSegundos,
      signableHeaders: new Set(['content-type']),
    });

    return {
      uploadUrl,
      expiraEnSegundos,
    };
  }

  async generarUrlPreFirmadaDescarga(
    params: GenerarPreFirmaDescargaParams,
  ): Promise<string> {
    const expiraEnSegundos =
      params.expiraEnSegundos ?? this.defaultExpirationSeconds;

    let disposition: string | undefined;
    if (params.nombreDescarga && (params.forzarDescarga ?? true)) {
      const nombreAsciiSeguro = params.nombreDescarga.replace(/["\\]/g, '_');
      const nombreUtf8Codificado = encodeURIComponent(params.nombreDescarga);
      disposition = `attachment; filename="${nombreAsciiSeguro}"; filename*=UTF-8''${nombreUtf8Codificado}`;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: params.objectKey,
      ...(disposition ? { ResponseContentDisposition: disposition } : {}),
    });

    return await getSignedUrl(this.publicSignerClient, command, {
      expiresIn: expiraEnSegundos,
    });
  }

  async verificarExistenciaObjeto(
    objectKey: string,
  ): Promise<MetadataObjetoStorage> {
    try {
      const response = await this.internalClient.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: objectKey,
        }),
      );

      return {
        existe: true,
        pesoBytes: response.ContentLength,
        mimeType: response.ContentType,
      };
    } catch (error) {
      if (
        error instanceof S3ServiceException &&
        (error.name === 'NotFound' ||
          error.name === 'NoSuchKey' ||
          error.$metadata?.httpStatusCode === 404)
      ) {
        return { existe: false };
      }

      this.logger.error(
        `Error de infraestructura al consultarHeadObject para la llave '${objectKey}'.`,
        error,
      );
      throw new InternalServerErrorException(
        'No fue posible verificar el estado del archivo en el servidor de almacenamiento.',
      );
    }
  }

  async eliminarObjeto(objectKey: string): Promise<void> {
    try {
      await this.internalClient.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: objectKey,
        }),
      );
    } catch (error) {
      this.logger.error(
        `Error al eliminar el objeto '${objectKey}' del almacenamiento S3.`,
        error,
      );
      throw new InternalServerErrorException(
        'Error al eliminar el archivo físico del servidor de almacenamiento.',
      );
    }
  }

  async eliminarObjetosEnLote(objectKeys: string[]): Promise<void> {
    if (objectKeys.length === 0) return;

    try {
      await this.internalClient.send(
        new DeleteObjectsCommand({
          Bucket: this.bucketName,
          Delete: {
            Objects: objectKeys.map((Key) => ({ Key })),
            Quiet: true,
          },
        }),
      );
    } catch (error) {
      this.logger.error(
        `Error al eliminar el lote de ${objectKeys.length} objetos en S3.`,
        error,
      );
      throw new InternalServerErrorException(
        'Error al eliminar archivos en lote del servidor de almacenamiento.',
      );
    }
  }
}
