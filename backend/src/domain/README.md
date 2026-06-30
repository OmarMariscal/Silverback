# 🧠 Capa de Dominio (Domain)

Esta es el núcleo de la aplicación. Aquí residen las reglas de negocio puras, tipos y máquinas de estado.

**⚠️ REGLA DE ORO:**
Está **ESTRICTAMENTE PROHIBIDO** importar cualquier dependencia externa aquí.
- NO `@nestjs/common`
- NO `@prisma/client`
- NO librerías de infraestructura.

**¿Qué va aquí?**
* Lógica matemática o de fechas (ej. cálculo del semáforo).
* Máquinas de estado (ej. flujos de aprobación del POA).
* Tipos puros de TypeScript e interfaces de negocio.