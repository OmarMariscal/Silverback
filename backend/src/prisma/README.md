# 🔌 Módulo de Conexión (Prisma Injection)

A diferencia de la carpeta `prisma/` en la raíz (que define la infraestructura), esta carpeta contiene la **integración de Prisma con el ecosistema de NestJS**. 

Aquí convertimos el cliente de Prisma en un proveedor inyectable para que nuestra capa de Módulos y Servicios pueda realizar consultas a la base de datos respetando la inyección de dependencias.

**¿Qué contiene esta carpeta?**

* **`prisma.service.ts`:** Un servicio que extiende `PrismaClient`. Se encarga de engancharse al ciclo de vida de NestJS implementando `OnModuleInit` para establecer la conexión a PostgreSQL tan pronto como el servidor arranca.
* **`prisma.module.ts`:** El módulo que empaqueta el servicio. Está decorado con `@Global()` para que `PrismaService` esté disponible en todo el backend sin necesidad de importar `PrismaModule` en cada uno de los módulos de negocio.

**⚠️ REGLA DE USO:**
Los desarrolladores **no deben instanciar** Prisma manualmente (`new PrismaClient()`). En su lugar, inyecten el servicio en el constructor de sus clases:
```typescript
constructor(private readonly prisma: PrismaService) {}