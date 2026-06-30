# 🛡️ Capa Core (Infraestructura Transversal)

Esta carpeta contiene la configuración global y los mecanismos de seguridad que envuelven a la aplicación de NestJS, pero que no pertenecen a un módulo de negocio específico.

**¿Qué va aquí?**
* **Auth:** Lógica de autenticación, estrategias de Passport y emisión de JWT.
* **Guards:** Protección de rutas (`JwtGuard`, `RolesGuard`).
* **Decorators:** Decoradores personalizados (`@UsuarioActual()`, `@Roles('JEFA')`).
* **Interceptors & Filters:** Manejo global de errores y formateo de respuestas.