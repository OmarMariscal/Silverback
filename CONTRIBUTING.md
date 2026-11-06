# 🏛️ Guía de Contribución para Silverback (SIMA)

¡Bienvenido al repositorio oficial de **SIMA (Sistema Integral de Monitoreo de Auditorías)**! Este documento establece los lineamientos técnicos, la arquitectura del proyecto, la integración entre **Git y Docker**, y las buenas prácticas que el equipo **MonkeyCode** debe seguir rigurosamente para asegurar un desarrollo limpio, colaborativo y profesional.

---

## 1. Arquitectura del Repositorio (Monorepo con Docker)

Silverback está estructurado como un **Monorepo** orquestado mediante **Docker Compose**. Los tres servicios principales (Base de Datos, Backend y Frontend) conviven en el mismo repositorio y se ejecutan en contenedores independientes y comunicados entre sí:

* **`db` (PostgreSQL 15)**: Motor de base de datos relacional aislado en contenedor con volumen persistente (`pgdata_dev`), exponiendo el puerto `5432` hacia tu máquina local.
* **`backend/` (NestJS)**: API REST central con arquitectura limpia, TypeScript, Prisma ORM y soporte para almacenamiento en **AWS S3** (módulo del contralor).
* **`frontend/` (Next.js 16 + Tailwind CSS v4)**: Interfaz de usuario reactiva para Jefatura y Contraloría.

### 🔄 ¿Cómo interactúan Docker y tus archivos en Local? (Hot-Reload)

Gracias al montaje de volúmenes en `docker-compose.yml`:
```yaml
volumes:
  - ./backend:/app
  - ./frontend:/app
```
Tu carpeta local de código está **conectada en vivo** con el interior de los contenedores:
* Cada vez que guardas un archivo en VS Code, el contenedor lo detecta y se actualiza de inmediato (*Hot-Reload*).
* Cuando cambias de rama en Git (`git switch`) o traes cambios (`git pull`), los contenedores reflejan automáticamente los nuevos archivos sin necesidad de reinstalaciones manuales.

---

## 2. Flujo de Trabajo en Git (GitFlow Adaptado)

Para proteger la estabilidad del proyecto, operamos bajo un esquema de ramas protegidas:

* **`main`**: Código estable y desplegable en producción. *(Protegida - Solo lectura directa)*.
* **`develop`**: Rama principal de integración y pruebas grupales. *(Protegida)*.
* **`feature/*`**: Ramas temporales para desarrollar nuevas características (ej. `feature/frontend-subactividades-poa`).
* **`fix/*`**: Ramas temporales para corrección de bugs (ej. `fix/bff-calculo-fechas`).

> ⛔ **Regla de Oro:** Nadie tiene permitido hacer `push` directo a `develop` ni a `main`. Todo cambio entra exclusivamente vía **Pull Request (PR)** revisado y aprobado por al menos un compañero.

---

## 3. Acordeón del Día a Día: Git + Docker Paso a Paso

Sigue esta rutina diaria para trabajar sin fricciones y evitar conflictos de código o dependencias:

### Paso 0: Prerrequisito indispensable
Antes de ejecutar cualquier comando de Docker, **abre la aplicación Docker Desktop en Windows** y asegúrate de que el motor esté corriendo (ícono de ballena verde con *"Engine running"* en la esquina inferior izquierda).

### Paso 1: Iniciar el entorno de desarrollo
Desde la **raíz del proyecto** (`Silverback/`), enciende todos los contenedores en segundo plano:
```bash
docker compose up -d
```
*(Opcional: Si quieres confirmar que la API compiló correctamente, corre `docker logs -f silverback_api_dev` y sal con `Ctrl + C`)*.

### Paso 2: Actualizar `develop` y crear tu rama de trabajo
```bash
# 1. Asegúrate de estar parado en la rama develop
git switch develop

# 2. Descarga lo último que haya subido el equipo
git pull origin develop

# 3. Crea tu rama efímera de trabajo y cámbiate a ella
# Formato: feature/entorno-nombre-tarea o fix/entorno-nombre-tarea
git switch -c feature/mi-nueva-funcionalidad

# 4. Mantén tu rama actualizada con develop antes de empezar a trabajar
git rebase develop
```

> 💡 **Nota sobre el orden:** Git y Docker son independientes. No importa si creas la rama antes o después de encender Docker.

### Paso 3: Desarrollar y verificar logs
Escribe código y visualiza los cambios en tu navegador:
* **Frontend:** [http://localhost:3001](http://localhost:3001)
* **Backend:** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
* **Swagger Docs:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

Si quieres ver lo que imprimen los contenedores o diagnosticar algún error:
```bash
# Ver logs de todos los contenedores en vivo:
docker compose logs -f

# O ver únicamente los logs del backend:
docker compose logs -f backend
```
*(Presiona `Ctrl + C` en cualquier momento para salir de la vista de logs; los contenedores seguirán funcionando).*

### Paso 4: Sincronizar cambios de dependencias o base de datos de otros compañeros
Si al hacer `git pull origin develop` notas que tus compañeros agregaron paquetes o migraciones (por ejemplo, el módulo de S3 o datos de prueba ampliados):

* **Si cambiaron los `package.json`:**
  ```bash
  docker compose up -d --build
  ```
* **Si se modificó el esquema de Prisma o se agregaron nuevas semillas (`backend/prisma/`):**
  Entra a la terminal del contenedor de la API y ejecuta:
  ```bash
  docker exec -it silverback_api_dev sh
  
  # Dentro de la terminal del contenedor:
  npx prisma migrate dev
  npx prisma generate
  npx prisma db seed
  exit
  ```
  *(Toma en cuenta que correr `npx prisma db seed` reemplazará los datos anteriores por la semilla oficial actualizada con los nuevos POAs y lógica de negocio).*

* **Para visualizar los datos inyectados en Prisma Studio:**
  Desde otra terminal local (afuera del contenedor), corre:
  ```bash
  npm run db:studio
  ```
  Y se abrirá automáticamente en tu navegador en [http://localhost:5556](http://localhost:5556).

### Paso 5: Guardar tus avances (Commits Semánticos)
```bash
# 1. Revisa qué archivos modificaste
git status

# 2. Prepara los archivos
git add .

# 3. Guarda con un commit semántico (ver sección 5)
git commit -m "feat(frontend): agrega acordeón de subactividades en poa"
```

### Paso 6: Subir tu rama y abrir el Pull Request
```bash
git push origin feature/mi-nueva-funcionalidad
```
Ve a GitHub, abre el **Pull Request hacia `develop`**, llena la plantilla explicando tus cambios y solicita la revisión de al menos un compañero.

### Paso 7: Al terminar tu jornada de trabajo
Para liberar memoria RAM y recursos de tu computadora:
```bash
docker compose stop
```
*(Al día siguiente, un simple `docker compose up -d` reanudará todo en segundos con tu base de datos y datos intactos).*

---

## 4. Guía Rápida de Comandos de Docker (¿Cuándo usar cada uno?)

| Comando | Acción | ¿Cuándo usarlo? |
| :--- | :--- | :--- |
| `docker compose up -d` | **Inicia** los contenedores en segundo plano. | Al comenzar a trabajar o al encender tu PC. |
| `docker compose stop` | **Pausa / Detiene** los contenedores sin borrar nada. | Al terminar tu día de trabajo. |
| `docker compose down` | **Apaga y elimina** los contenedores y la red virtual. | Cuando quieras reiniciar el entorno limpiamente (conserva la base de datos). |
| `docker compose down -v` | **Elimina contenedores Y volúmenes de datos.** | ⚠️ **Cuidado:** Borra toda la base de datos local para iniciarla de cero. |
| `docker compose up -d --build` | Reconstruye las imágenes de Docker y arranca. | Cuando se instalen nuevas librerías en `package.json`. |
| `docker compose logs -f [servicio]` | Transmite los logs de la consola en tiempo real. | Para depurar errores o ver qué consultas SQL se están ejecutando. |
| `docker exec -it silverback_api_dev sh` | Abre una terminal interactiva dentro de la API. | Para ejecutar comandos de Prisma (`migrate`, `generate`, `seed`). |
| `npm run db:studio` | Abre Prisma Studio en la máquina local (puerto 5556). | Para inspeccionar tablas y registros en el navegador. |

---

## 5. Convención de Commits (Conventional Commits)

Todos los mensajes de confirmación deben seguir la estructura: `tipo(alcance): descripción breve en minúsculas y modo imperativo`.

* **`feat(...)`**: Una nueva funcionalidad para el usuario.  
  *Ejemplo:* `git commit -m "feat(backend): agrega módulo para subida de archivos s3"`
* **`fix(...)`**: Corrección de un error o comportamiento inesperado.  
  *Ejemplo:* `git commit -m "fix(backend): visualización de base de datos vía prisma studio"`
* **`docs(...)`**: Cambios exclusivos en documentación (`README.md`, `CONTRIBUTING.md`, etc.).  
  *Ejemplo:* `git commit -m "docs(contributing): documenta nuevo script db:studio y seed ampliado"`
* **`chore(...)`**: Tareas de configuración, dependencias o tooling.  
  *Ejemplo:* `git commit -m "chore(docker): ajusta puertos de api y configuración de base de datos"`
* **`refactor(...)`**: Refactorización de código que no altera el comportamiento funcional.  
  *Ejemplo:* `git commit -m "refactor(frontend): desacopla adaptador de datos del dashboard"`

---

## 6. Base de Datos y Prisma

### Inicialización Local y Actualizaciones de Semilla
Cada vez que el equipo de backend actualice el modelo de datos o la semilla (por ejemplo, con nuevos POAs y soporte para S3), aplica los cambios con:
```bash
docker exec -it silverback_api_dev sh
# Dentro del contenedor:
npx prisma migrate dev
npx prisma generate
npx prisma db seed
exit
```

### 🗄️ Visualización de la Base de Datos Local
Para visualizar las tablas y registros en tu navegador:
1. Con los contenedores corriendo, abre una terminal en la raíz (afuera del contenedor).
2. Ejecuta:
   ```bash
   npm run db:studio
   ```
3. Se abrirá automáticamente [http://localhost:5556](http://localhost:5556) con Prisma Studio conectado a la base de datos local de Docker.

También puedes usar extensiones en VS Code (Database Client / PostgreSQL) o clientes de escritorio (DBeaver, TablePlus) apuntando a `localhost:5432` con usuario `postgres`, contraseña la configurada en tu `.env` (ej. `tu_password_local` o `root`) y base de datos `TestingSilverBack` (o `silverback` según tu .env).

### 🌐 Alternativa Opcional: Conectar a Base de Datos en Neon
Si necesitas temporalmente una base de datos en la nube (Neon):
1. En `docker-compose.yml`, cambia la variable `DATABASE_URL` del `backend`:
   ```yaml
   environment:
     DATABASE_URL: ${DATABASE_URL}
   ```
2. En tu archivo `.env` en la raíz, coloca tu URL de Neon:
   ```env
   DATABASE_URL="postgresql://neondb_owner:password@ep-ejemplo.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Reinicia los contenedores: `docker compose down && docker compose up -d`.

---

## 7. Requisitos para el Pull Request (PR)

Antes de solicitar la integración de tu código a `develop`:
1. **Verificación de Tipos y Compilación:** Asegúrate de que no existan errores de TypeScript ni de compilación:
   ```bash
   # Frontend:
   npm --prefix frontend run build
   ```
2. **Sin claves en código:** Verifica que no hayas commiteado archivos `.env` reales con contraseñas o tokens.
3. **Descripción clara:** Completa todos los apartados de la plantilla del Pull Request describiendo qué hace tu cambio, cómo probarlo y qué partes del Monorepo afecta.
