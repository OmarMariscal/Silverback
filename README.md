# 🏛️ Sistema Integral de Monitoreo de Auditorías (SIMA) - Contraloría

Un sistema avanzado para la digitalización, control y seguimiento del Plan Operativo Anual (POA), gestión de personal auditor y administración documental de la Contraloría.

---

## 🎯 Propósito del Proyecto

Esta plataforma centraliza la planeación estratégica y la ejecución de auditorías. Provee un entorno unificado que asiste al personal auditor en su trabajo de campo y entrega herramientas de visualización de datos (Dashboard) a nivel gerencial para la toma de decisiones.

El ciclo de vida del sistema abarca:
1. **Planeación:** Creación, revisión y autorización de POAs anuales.
2. **Ejecución:** Asignación de cargas de trabajo basadas en el Catálogo de Actividades institucional.
3. **Gestión Documental:** Almacenamiento seguro, versionado de archivos y resguardo de evidencias de auditoría mediante infraestructura en la nube (AWS S3) para el módulo del contralor.

---

## 🏗️ Arquitectura Técnica

El proyecto está estructurado bajo un enfoque de **Monorepo**, garantizando la sincronización absoluta entre los contratos de datos (API) y las interfaces de usuario.

### Stack Tecnológico
* **Backend:** [NestJS](https://nestjs.com/) (Node.js) implementando *Clean Architecture* (Controladores, Servicios, Módulos, Core de seguridad y Dominio).
* **Frontend:** [Next.js](https://nextjs.org/) (React 19) con [Tailwind CSS v4](https://tailwindcss.com/) para una interfaz de usuario reactiva y accesible.
* **Base de Datos:** Relacional, utilizando **PostgreSQL 15**.
* **ORM:** [Prisma](https://www.prisma.io/) para modelado de datos, tipado estricto y migraciones seguras.
* **Contenedores:** [Docker](https://www.docker.com/) y **Docker Compose** para estandarizar el ambiente completo de desarrollo (Frontend + Backend + Base de Datos).
* **Almacenamiento:** Integración con **AWS S3** para el resguardo de anexos, evidencias y gestión documental del contralor.

---

## 🔒 Seguridad y Control de Acceso

El sistema implementa una arquitectura de aislamiento de datos por contexto (*Data Tenant Isolation*). La autenticación y autorización se gestionan mediante **JSON Web Tokens (JWT)**, limitando el acceso y la visibilidad de la información según el rol operativo:
* **Jefatura:** Acceso global a reportes, métricas y autorización/devolución de POAs de todos los centros.
* **Contraloría:** Acceso restringido exclusivamente a los datos, actividades y personal de su Centro Universitario correspondiente.

---

## 🚀 Entorno de Desarrollo Local con Docker

El proyecto está completamente dockerizado. Ya no es necesario instalar ni configurar PostgreSQL localmente en tu sistema operativo: Docker levanta y conecta el frontend, el backend y la base de datos automáticamente.

### 📂 Estructura del Proyecto

```text
📦 Silverback
 ┣ 📂 backend           # API central y contratos de datos (NestJS + Prisma)
 ┣ 📂 frontend          # Aplicación web interactiva (Next.js + Tailwind CSS)
 ┣ 📜 docker-compose.yml# Orquestación de contenedores en desarrollo
 ┣ 📜 package.json      # Orquestación de workspaces y scripts globales
 ┗ 📜 package-lock.json # Congelación exacta de versiones para todo el equipo
```

### Prerrequisitos
1. **Node.js:** Versión 18 o superior (v20 recomendada).
2. **Git:** Para control de versiones.
3. **Docker Desktop:** Instalado y **abierto en ejecución** (debe mostrar el ícono de la ballena en verde con la leyenda *"Engine running"* en la esquina inferior).

---

### 1. Clonar e Instalar Dependencias

```bash
git clone https://github.com/OmarMariscal/Silverback
cd Silverback

# Instala las dependencias del backend, frontend y la raíz simultáneamente
npm install
```

---

### 2. Configuración de Variables de Entorno (`.env`)

Crea un archivo llamado **`.env`** en la **raíz del proyecto** (`Silverback/.env`) y también dentro de `Silverback/backend/.env` con la configuración de tu entorno local:

```env
# Configuración del contenedor de PostgreSQL local
DB_USER="postgres"
DB_PASSWORD="tu_password_local"
DB_NAME="TestingSilverBack"

DATABASE_URL="postgresql://postgres:tu_password_local@db:5432/TestingSilverBack?schema=public"
NODE_ENV="development"
```

> ⚠️ **Importante:** Docker Compose lee el archivo `.env` ubicado en la **raíz** para configurar las credenciales de PostgreSQL. Asegúrate de tenerlo presente en esa ubicación.

---

### 3. Ejecución del Sistema con Docker Compose

1. **Abre Docker Desktop** en tu computadora y espera a que el motor termine de iniciar.
2. Desde la **raíz del proyecto** (`Silverback/`), inicia los contenedores en segundo plano:
   ```bash
   docker compose up -d
   ```
3. *(Opcional)* Para verificar que la API compile correctamente en el contenedor:
   ```bash
   docker logs -f silverback_api_dev
   ```
   *(Presiona `Ctrl + C` una vez que veas que compiló con éxito).*

4. **Inicializa la Base de Datos, Cliente Prisma y Datos de Prueba (Seed):**  
   Puedes ingresar a la terminal del contenedor de la API o ejecutar los comandos directamente:

   **Opción rápida (dentro del contenedor):**
   ```bash
   docker exec -it silverback_api_dev sh
   # Dentro del contenedor:
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   exit
   ```

   **O directamente desde tu terminal local:**
   ```bash
   docker compose exec backend npx prisma migrate dev
   docker compose exec backend npx prisma generate
   docker compose exec backend npx prisma db seed
   ```

---

### 🌐 Servicios Disponibles

| Servicio | URL Local | Descripción |
| :--- | :--- | :--- |
| **Frontend Web** | [http://localhost:3001](http://localhost:3001) | Aplicación interactiva de SIMA (Next.js) |
| **Backend API** | [http://localhost:3000/api/v1](http://localhost:3000/api/v1) | Servidor NestJS REST API |
| **Swagger Docs** | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) | Documentación interactiva de endpoints (OpenAPI) |
| **Prisma Studio** | [http://localhost:5556](http://localhost:5556) | Visor gráfico de tablas y datos (vía `npm run db:studio`) |
| **PostgreSQL** | `localhost:5432` | Servidor de base de datos local en contenedor |

---

### 🗄️ Visualización y Administración de la Base de Datos

* **Prisma Studio (Oficial):**  
  Para inspeccionar, editar o consultar las tablas y datos semilla de forma visual:
  1. Con los contenedores de Docker encendidos, abre una **terminal en la raíz del proyecto** (fuera de Docker).
  2. Ejecuta:
     ```bash
     npm run db:studio
     ```
  3. Se abrirá automáticamente una pestaña en tu navegador en [http://localhost:5556](http://localhost:5556) con Prisma Studio conectado a tu base de datos local.

* **Extensiones de VS Code o Clientes SQL externos (DBeaver, TablePlus, pgAdmin):**  
  Dado que el puerto `5432` está expuesto al host, puedes conectarte directamente con los siguientes parámetros:
  * **Host:** `localhost`
  * **Puerto:** `5432`
  * **Usuario:** `postgres`
  * **Contraseña:** Tu contraseña configurada en el `.env` *(ej. `tu_password_local` o `root`)*
  * **Base de datos:** `TestingSilverBack` *(o `silverback` según tu .env)*

* **Alternativa con Base de Datos en Neon (Nube):**  
  Si de manera opcional necesitas conectar el entorno a una base de datos externa en Neon:
  1. En `docker-compose.yml`, ajusta la variable `DATABASE_URL` del servicio `backend`:
     ```yaml
     environment:
       DATABASE_URL: ${DATABASE_URL}
     ```
  2. En tu archivo `.env` de la raíz, define tu URL de Neon:
     ```env
     DATABASE_URL="postgresql://usuario:password@ep-ejemplo.us-east-2.aws.neon.tech/neondb?sslmode=require"
     ```
  3. Reinicia los contenedores: `docker compose down && docker compose up -d`.

---

### 🛠️ Comandos Esenciales de Docker Compose

| Comando | Acción | ¿Cuándo usarlo? |
| :--- | :--- | :--- |
| `docker compose up -d` | Enciende todos los contenedores en segundo plano. | Al comenzar a trabajar en el día. |
| `docker compose stop` | Detiene/pausa los contenedores sin borrar nada. | Al terminar tu jornada de trabajo. |
| `docker compose down` | Apaga y destruye los contenedores y la red virtual (conserva datos). | Cuando quieras reiniciar el entorno por completo. |
| `docker compose down -v` | Apaga y **elimina los volúmenes de datos**. | **Precaución:** Úsalo solo si necesitas resetear la BD a cero. |
| `docker compose up -d --build` | Reconstruye las imágenes e inicia contenedores. | Si se instalaron nuevas dependencias en `package.json`. |
| `docker compose logs -f` | Muestra los logs en vivo de todos los servicios. | Para depurar errores (salir con `Ctrl + C`). |
| `docker compose logs -f backend` | Muestra los logs en vivo exclusivamente del backend. | Para depurar endpoints y consultas SQL. |
| `npm run db:studio` | Levanta Prisma Studio en el puerto 5556. | Para visualizar y explorar los registros de la base de datos. |

---

### 👥 Flujo de Trabajo y Colaboración (GitFlow Adaptado)

Para asegurar la máxima calidad del código, mitigar conflictos y sincronizar el trabajo paralelo del equipo de ingeniería, operamos bajo el siguiente modelo ágil de control de versiones.

#### Estructura de Ramas

- **`main`**: Refleja el código en producción/entregable final. *(Protegida - Solo lectura directa)*.  
- **`develop`**: Rama principal de integración y entorno de pruebas compartido. *(Protegida)*.  
- **`feature/*`**: Ramas efímeras de trabajo individual para nuevas características (ej. `feature/frontend-dashboard-jefa`).  
- **`fix/*`**: Ramas efímeras para corrección de errores (ej. `fix/backend-calculo-fechas`).

#### Reglas de Integración Continua (Pull Requests)

- **Restricción Estricta:** Ningún desarrollador tiene permisos para hacer `push` directo a **develop** o **main**.  
- **Pull Requests (PR):** Todo código funcional nuevo debe solicitar su integración abriendo un PR hacia **develop**.  
- **Revisión de Pares (Code Review):** Se requiere la revisión de código y aprobación obligatoria de al menos **un (1)** compañero del equipo antes de habilitar el botón de Merge.  
- **Conventional Commits:** Es imperativo utilizar mensajes de commit semánticos para automatizar el registro de cambios (Changelog) y mantener un historial rastreable:

```text
feat(backend): agrega servicio de filtrado de catálogos
fix(frontend): ajusta estado de carga en botón de login
docs(api): documenta código 400 en endpoint de auditores
```

Para una guía completa paso a paso sobre el uso diario de Git y Docker, consulta el archivo [CONTRIBUTING.md].
