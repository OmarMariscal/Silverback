# 🗄️ Infraestructura de Base de Datos (Prisma Root)

Esta carpeta es la **fuente única de verdad** para la estructura de la base de datos. Está ubicada fuera de `src/` porque contiene definiciones y scripts de infraestructura que no forman parte de la compilación de la aplicación de NestJS.

**¿Qué contiene esta carpeta?**

* **`schema.prisma`:** El archivo de modelado principal. Aquí se definen los modelos (tablas), las relaciones, y la configuración de conexión a PostgreSQL.
* **`migrations/`:** Carpeta autogenerada por Prisma. Contiene el historial inmutable de cambios estructurales en la base de datos (archivos `.sql`). **Regla de oro: NUNCA se debe modificar un archivo de migración manualmente una vez generado.**
* **`seed.ts` (o directorio `seeds/`):** Scripts para la siembra de datos iniciales. Utilizado para inyectar catálogos predeterminados, usuarios de prueba y roles necesarios para que el sistema funcione en un entorno limpio.

**Comandos Útiles:**
* Crear una migración: `npx prisma migrate dev --name <nombre_descriptivo>`
* Poblar base de datos: `npx prisma db seed`
* Ver interfaz gráfica: `npx prisma studio`