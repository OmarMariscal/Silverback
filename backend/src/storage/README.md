# Módulo de Almacenamiento de Objetos (Storage Infrastructure)

Al igual que `src/prisma/` encapsula el motor de base de datos relacional, esta carpeta contiene el **Adaptador de Infraestructura** para el almacenamiento de objetos compatibles con S3 (SeaweedFS en desarrollo local y AWS S3 en producción).

## ¿Qué contiene esta carpeta?
* **`s3-storage.adapter.ts`:** Implementación concreta del puerto `IStoragePort` (`@core/interfaces/storage/storage-port.interface`). Maneja la firma criptográfica AWS Signature V4 (`getSignedUrl`), la verificación física de objetos (`HeadObject`) y el borrado de archivos.
* **`storage.module.ts`:** Módulo decorado con `@Global()` que vincula el token `STORAGE_PORT_TOKEN` con `S3StorageAdapter`.

## Regla de Uso (Arquitectura Hexagonal)
Los servicios de aplicación (`modules/*/application/*.service.ts`) **NUNCA** deben importar `@aws-sdk/client-s3` ni `S3StorageAdapter` directamente. Deben inyectar el puerto mediante su token:

```typescript
constructor(
  @Inject(STORAGE_PORT_TOKEN)
  private readonly storagePort: IStoragePort,
) {}