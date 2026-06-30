# ⚙️ Capa de Módulos (Capacidades de Negocio)

Aquí es donde ocurre la orquestación. Estos módulos conectan las peticiones HTTP del cliente con la base de datos (Prisma) y las reglas de negocio (Dominio).

**Estructura interna esperada por módulo:**
* `*.controller.ts`: Exposición de rutas HTTP (GET, POST) y validación de entrada.
* `*.service.ts`: Casos de uso. Orquesta la base de datos y llama a funciones del Dominio.
* `dto/`: Objetos de Transferencia de Datos.
  * `request/`: Clases con `class-validator` para validar lo que entra (ej. `CrearPoaRequestDto`).
  * `response/`: Clases o interfaces de lo que devolvemos (ej. `PoaResumenResponseDto`).

*Nota: Los catálogos simples pueden generarse con `nest g res`, pero flujos complejos como `poa/` deben estructurarse manualmente para mantener el control.*