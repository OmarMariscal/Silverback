# 🏛️ Sistema Integral de Gestión y Auditoría - Contraloría

Un sistema avanzado para la digitalización, control y seguimiento del Plan Operativo Anual (POA), gestión de personal auditor y administración documental de la Contraloría.

---

## 🎯 Propósito del Proyecto

Esta plataforma centraliza la planeación estratégica y la ejecución de auditorías. Provee un entorno unificado que asiste al personal auditor en su trabajo de campo y entrega herramientas de visualización de datos (Dashboard) a nivel gerencial para la toma de decisiones.

El ciclo de vida del sistema abarca:
1.  **Planeación:** Creación, revisión y autorización de POAs anuales.
2.  **Ejecución:** Asignación de cargas de trabajo basadas en el Catálogo de Actividades institucional.
3.  **Gestión Documental:** Almacenamiento seguro, versionado de archivos y resguardo de evidencias de auditoría mediante infraestructura en la nube (AWS S3).

---

## 🏗️ Arquitectura Técnica

El proyecto está estructurado bajo un enfoque de **Monorepo**, garantizando la sincronización absoluta entre los contratos de datos (API) y las interfaces de usuario.

### Stack Tecnológico
*   **Backend:** [NestJS](https://nestjs.com/) (Node.js) implementando *Clean Architecture* (Controladores, Servicios, Módulos, Core de seguridad y Dominio).
*   **Frontend:** [NextJS](https://nextjs.org/) (React) para una interfaz de usuario reactiva y optimizada.
*   **Base de Datos:** Relacional, utilizando **PostgreSQL**.
*   **ORM:** [Prisma](https://www.prisma.io/) para un tipado estricto y migraciones seguras.
*   **Almacenamiento:** Integración con **AWS S3** para el versionado y resguardo documental.

---

## 🔒 Seguridad y Control de Acceso

El sistema implementa una arquitectura de aislamiento de datos por contexto (*Data Tenant Isolation*). La autenticación y autorización se gestionan mediante **JSON Web Tokens (JWT)**, limitando el acceso y la visibilidad de la información según el rol operativo:
*   **Jefatura:** Acceso global a reportes, métricas y autorización de POAs.
*   **Contraloría:** Acceso restringido exclusivamente a los datos y personal de su Centro Universitario correspondiente.

---

## 🚀 Entorno de Desarrollo Local

El sistema utiliza `npm` para gestionar dependencias de forma aislada sin necesidad de entornos virtuales manuales.

### 📂 Estructura del Proyecto

```text
📦 Silverback
 ┣ 📂 backend           # API central y contratos de datos (NestJS)
 ┣ 📂 frontend          # Aplicación web interactiva (NextJS)
 ┣ 📜 package.json      # Orquestación de workspaces y scripts globales
 ┗ 📜 package-lock.json # Congelación exacta de versiones para todo el equipo
```

### Prerrequisitos
* Node.js (v18 o superior)
* PostgreSQL (v14 o superior) local o en Docker.
* Git

### 1. Clonar e Instalar

Gracias a la arquitectura de **npm workspaces**, la instalación de dependencias está centralizada. Solo necesitas ejecutar un comando en la raíz para instalar todo el ecosistema.

```bash
git clone https://github.com/OmarMariscal/Silverback
cd Silverback


# Instala las dependencias del backend, frontend y la raíz simultáneamente
npm ci
```
---

### 2. Configuración de Variables de Entorno

En la carpeta **/backend**, localiza el archivo de plantilla **`.env.example`**. Crea una copia exacta llamada **`.env`** y configura tus credenciales locales para conectar la base de datos y la seguridad.

**Backend (backend/.env):**

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/contraloria_db?schema=public"
JWT_SECRET="clave_secreta_para_desarrollo"
```

> **Nota:** Se debe repetir el proceso en la carpeta **/frontend** según las variables que requiera la interfaz.

---

### 3. Inicialización de la Base de Datos

Desde la carpeta **/backend**, ejecuta los comandos de Prisma para construir el esquema relacional en tu motor local e inyectar el catálogo de prueba y los usuarios iniciales (Siembra / Seed):

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

---

### 4. Ejecución del Sistema

Los scripts de arranque están unificados en el `package.json` de la raíz del monorepositorio. Para comenzar a programar, abre dos terminales en la **raíz del proyecto** (`/Silverback`) y ejecuta:

**Terminal 1 (Backend - NestJS):**

```bash
npm run dev:backend
```

**Terminal 2 (Frontend - NextJS):**

```bash
npm run dev:frontend
```


### 📜 Contratos de API y Documentación (Swagger)

El backend expone su documentación interactiva mediante la especificación OpenAPI (Swagger). Una vez que el servidor NestJS esté en ejecución, los contratos de datos, esquemas de validación (DTOs) y ejemplos de respuesta (Mocks) estarán disponibles en:

**http://localhost:3000/api/docs**

**Nota para el equipo de pruebas:** La especificación puede ser exportada en formato JSON desde la esquina superior de la interfaz de Swagger para importar y autogenerar colecciones exactas de endpoints en Postman.

---

### 👥 Flujo de Trabajo y Colaboración (GitFlow Adaptado)

Para asegurar la máxima calidad del código, mitigar conflictos (Merge Hell) y sincronizar el trabajo paralelo del equipo de ingeniería, operamos bajo el siguiente modelo ágil de control de versiones.

#### Estructura de Ramas

- **main**: Refleja el código en producción/entregable final. (Protegida - Solo lectura directa).  
- **develop**: Rama principal de integración y entorno de pruebas. (Protegida).  
- **feature/***: Ramas efímeras de trabajo individual para nuevas características (ej. `feature/frontend-dashboard-jefa`).  
- **fix/***: Ramas efímeras para corrección de errores (ej. `fix/backend-calculo-fechas`).

#### Reglas de Integración Continua (Pull Requests)

- **Restricción Estricta:** Ningún desarrollador tiene permisos para hacer push directo a **develop** o **main**.  
- **Pull Requests (PR):** Todo código funcional nuevo debe solicitar su integración abriendo un PR hacia **develop**.  
- **Revisión de Pares (Code Review):** Se requiere la revisión de código y aprobación obligatoria de al menos **un (1)** compañero del equipo antes de habilitar el botón de Merge.  
- **Conventional Commits:** Es imperativo utilizar mensajes de commit semánticos para automatizar el registro de cambios (Changelog) y mantener un historial rastreable.

**Ejemplos de Conventional Commits**

```text
feat(backend): agrega servicio de filtrado de catálogos
fix(frontend): ajusta estado de carga en botón de login
docs(api): documenta código 400 en endpoint de auditores
```
