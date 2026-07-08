```markdown
# 🏛️ Guía de Contribución para Silverback

¡Bienvenido al repositorio oficial de Silverback! Este documento establece los lineamientos técnicos, la estructura del proyecto y el flujo de trabajo en Git que el equipo **MonkeyCode** debe seguir rigurosamente para asegurar un desarrollo limpio, colaborativo y profesional.

---

## 1. Arquitectura del Repositorio (Monorepo)

Silverback está estructurado como un **Monorepo**. Esto significa que tanto el código del servidor como el de la interfaz de usuario viven en el mismo repositorio, pero están estrictamente separados en carpetas independientes:

* **`backend/`**: El motor del sistema. Desarrollado con **NestJS**, utiliza **Prisma ORM** para comunicarse con la base de datos PostgreSQL.
* **`frontend/`**: La interfaz de usuario. Una aplicación web responsiva desarrollada con **Next.js** y estilizada con **Tailwind CSS**.

### Inicialización del Entorno Local

Para empezar a trabajar en tu computadora, debes instalar las dependencias de cada entorno de forma aislada. **No instales paquetes globales en la raíz si no es necesario.**

1. **Instalar dependencias del Backend:**
   ```bash
   cd backend
   npm install

```

2. **Instalar dependencias del Frontend:**
```bash
cd ../frontend
npm install

```

*Nota: Recuerda configurar tus archivos `.env` locales dentro de las carpetas `backend/` y `frontend/` basándote en los archivos de ejemplo correspondientes (nunca subas las claves ni contraseñas reales a GitHub).*

---

## 2. Flujo de Trabajo en Git (GitFlow Adaptado)

Para proteger la estabilidad del proyecto, trabajaremos con un esquema de ramas protegido. **Nadie tiene permitido hacer un `push` directo a las ramas principales.**

### Estructura de Ramas

* **`main`**: Refleja exclusivamente el código estable en producción (entregas finales a la profesora/cliente). **[PROTEGIDA]**
* **`develop`**: Es nuestra rama principal de integración. Todo el equipo unifica sus avances aquí para realizar pruebas grupales. **[PROTEGIDA]**
* **`feature/*`**: Ramas temporales para desarrollar nuevas características (ej. `feature/backend-login`).
* **`fix/*`**: Ramas temporales para corregir errores encontrados en el sistema (ej. `fix/ui-botones-dashboard`).

### Reglas para Integrar Código (Pull Requests)

Todo cambio o nueva funcionalidad debe solicitar su integración a la rama `develop` mediante un **Pull Request (PR)** en GitHub. El PR requiere obligatoriamente:

1. Completar la plantilla explicando qué cambios introduce.
2. La revisión y **aprobación de al menos un (1) compañero** del equipo (*Code Review*) antes de poder hacer el *Merge*.

---

## 3. Acordeón de Comandos Git: Guía Paso a Paso para el Día a Día

Si eres nuevo con Git o quieres evitar errores, sigue esta receta de comandos en orden exacto cada vez que vayas a trabajar en una tarea.

### Paso 1: Antes de empezar a programar (Actualizar tu entorno)

Antes de crear una rama, asegúrate de tener lo último que hayan subido tus compañeros para evitar conflictos:

```bash
# 1. Asegúrate de estar parado en la rama develop
git switch develop

# 2. Descarga los últimos cambios del servidor de GitHub a tu máquina
git pull origin develop

```

### Paso 2: Crear tu rama de trabajo

Crea una rama efímera con un nombre descriptivo según tu rol:

```bash
# Crea y te cambia automáticamente a tu nueva rama
# Formato: feature/entorno-nombre-tarea
git switch -c feature/backend-sistema-semaforos
# (O si usas una versión antigua de Git: git checkout -b feature/backend-sistema-semaforos)

```

### Paso 3: Guardar tus avances en Local (Hacer Commits)

Mientras programas, guarda tus cambios periódicamente en el historial local de tu computadora.

```bash
# 1. Revisa qué archivos has modificado o agregado
git status

# 2. Agrega los archivos que quieres guardar al "escenario"
git add .   # (El punto agrega todos los archivos modificados, ten cuidado de no incluir basura)

# 3. Guarda los cambios con un mensaje semántico (Conventional Commits)
git commit -m "feat(backend): implementa cálculo de días hábiles para semáforo"

```

### Paso 4: Mantener tu rama al día (Evitar conflictos)

Si estuviste trabajando varios días en tu rama, es muy probable que `develop` haya avanzado en GitHub. Antes de subir tu código, fusiónale lo nuevo de `develop`:

```bash
# Trae lo último de develop a tu rama actual para resolver conflictos en tu máquina si los hay
git pull origin develop

```

### Paso 5: Subir tus cambios y abrir el Pull Request

Cuando tu tarea esté terminada y probada localmente, súbela a GitHub:

```bash
# Sube tu rama al servidor remoto
git push origin feature/backend-sistema-semaforos

```

*Una vez hecho esto, entra a la página de GitHub de tu repositorio, haz clic en el botón verde **"Compare & pull request"** y solicita la revisión de tu equipo.*

---

## 4. Convención de Mensajes (Conventional Commits)

Para mantener una bitácora legible y profesional, todos los mensajes de los commits deben seguir esta estructura: `tipo(entorno): descripción corta en minúsculas`.

* **`feat(...)`**: Una nueva funcionalidad.
* *Ejemplo:* `git commit -m "feat(frontend): añade panel visual de observaciones para la jefa"`


* **`fix(...)`**: Reparación de un error/bug.
* *Ejemplo:* `git commit -m "fix(backend): corrige bug en formato de fechas UTC-6"`


* **`docs(...)`**: Cambios en la documentación (como este archivo o el README).
* *Ejemplo:* `git commit -m "docs(root): actualiza instrucciones de instalación de dependencias"`


* **`chore(...)`**: Tareas de mantenimiento, actualización de librerías o configuración del proyecto.
* *Ejemplo:* `git commit -m "chore(backend): instala paquete de validación de esquemas"`



---

## 5. Directrices Técnicas Específicas de Silverback

### Para el Backend (NestJS + Prisma)

* **Migraciones de Base de Datos:** Si realizas un cambio en el archivo `schema.prisma`, debes crear y aplicar la migración local correspondiente antes de hacer commit:
```bash
npx prisma migrate dev --name descripcion_del_cambio

```


* **Validación de Datos:** Utiliza siempre los DTOs (Data Transfer Objects) para asegurar que el Frontend mande la información con el formato y las reglas de negocio correctas.

### Para el Frontend (NextJS + Tailwind)

* **Diseño Responsivo:** Diseña siempre pensando primero en pantallas de escritorio (que es donde la Jefa y los Contralores usarán el sistema de forma exhaustiva), pero utilizando las utilidades de Tailwind (`md:`, `lg:`) para asegurar que la UI no se rompa en pantallas más compactas.
* **Rutas Protegidas:** Toda vista que requiera un rol específico (como la pantalla de visualización masiva de la Jefa) debe estar protegida lógicamente mediante los mecanismos de autenticación cliente.

```