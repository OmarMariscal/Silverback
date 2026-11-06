-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'JEFA', 'CONTRALOR', 'AUDITOR');

-- CreateEnum
CREATE TYPE "TipoActividad" AS ENUM ('AUDITORIA', 'REVISION');

-- CreateEnum
CREATE TYPE "EstadoPoa" AS ENUM ('BORRADOR', 'EN_REVISION', 'DEVUELTA', 'AUTORIZADO');

-- CreateEnum
CREATE TYPE "EstadoSubActividad" AS ENUM ('SIN_EMPEZAR', 'SOLICITADO', 'EN_PROGRESO', 'EN_REVISION', 'DEVUELTA', 'CONCLUIDA');

-- CreateTable
CREATE TABLE "CentroUniversitario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "clave" TEXT NOT NULL,

    CONSTRAINT "CentroUniversitario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password_encriptada" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jefa" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,

    CONSTRAINT "Jefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contralor" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "centro_id" TEXT NOT NULL,
    "jefa_id" TEXT NOT NULL,

    CONSTRAINT "Contralor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditor" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "contralor_id" TEXT NOT NULL,

    CONSTRAINT "Auditor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BancoActividad" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "justificacion_plantilla" TEXT,
    "objetivo_gen_plantilla" TEXT,
    "objetivos_part_plantilla" TEXT,
    "metas_plantilla" TEXT,
    "indicadores" TEXT,

    CONSTRAINT "BancoActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BancoSubActividad" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo_sugerido" "TipoActividad" NOT NULL,
    "banco_actividad_id" TEXT NOT NULL,

    CONSTRAINT "BancoSubActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poa" (
    "id" TEXT NOT NULL,
    "anio_fiscal" INTEGER NOT NULL,
    "estado" "EstadoPoa" NOT NULL DEFAULT 'BORRADOR',
    "fecha_aprobado" TIMESTAMP(3),
    "mensaje_resolucion" TEXT,
    "contralor_id" TEXT NOT NULL,
    "centro_id" TEXT NOT NULL,

    CONSTRAINT "Poa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "justificacion" TEXT,
    "objetivo_general" TEXT,
    "objetivos_part" TEXT,
    "meta_proyecto" TEXT,
    "indicadores" TEXT,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_termino" TIMESTAMP(3),
    "porcentaje_global" DOUBLE PRECISION DEFAULT 0.0,
    "es_rezago" BOOLEAN NOT NULL DEFAULT false,
    "poa_id" TEXT NOT NULL,
    "banco_actividad_id" TEXT,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActividadAuditor" (
    "actividad_id" TEXT NOT NULL,
    "auditor_id" TEXT NOT NULL,

    CONSTRAINT "ActividadAuditor_pkey" PRIMARY KEY ("actividad_id","auditor_id")
);

-- CreateTable
CREATE TABLE "SubActividad" (
    "id" TEXT NOT NULL,
    "numero_orden" TEXT NOT NULL,
    "descripcion_tarea" TEXT NOT NULL,
    "estado_operativo" "EstadoSubActividad" NOT NULL DEFAULT 'SIN_EMPEZAR',
    "mensaje_observacion" TEXT,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_termino" TIMESTAMP(3) NOT NULL,
    "fecha_envio" TIMESTAMP(3),
    "semanas_totales" INTEGER NOT NULL,
    "tipo" "TipoActividad" NOT NULL,
    "actividad_id" TEXT NOT NULL,
    "banco_sub_actividad_id" TEXT,

    CONSTRAINT "SubActividad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CentroUniversitario_nombre_key" ON "CentroUniversitario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CentroUniversitario_clave_key" ON "CentroUniversitario"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Jefa_usuario_id_key" ON "Jefa"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Contralor_usuario_id_key" ON "Contralor"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Auditor_usuario_id_key" ON "Auditor"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Poa_contralor_id_anio_fiscal_key" ON "Poa"("contralor_id", "anio_fiscal");

-- AddForeignKey
ALTER TABLE "Jefa" ADD CONSTRAINT "Jefa_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contralor" ADD CONSTRAINT "Contralor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contralor" ADD CONSTRAINT "Contralor_centro_id_fkey" FOREIGN KEY ("centro_id") REFERENCES "CentroUniversitario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contralor" ADD CONSTRAINT "Contralor_jefa_id_fkey" FOREIGN KEY ("jefa_id") REFERENCES "Jefa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditor" ADD CONSTRAINT "Auditor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditor" ADD CONSTRAINT "Auditor_contralor_id_fkey" FOREIGN KEY ("contralor_id") REFERENCES "Contralor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BancoSubActividad" ADD CONSTRAINT "BancoSubActividad_banco_actividad_id_fkey" FOREIGN KEY ("banco_actividad_id") REFERENCES "BancoActividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poa" ADD CONSTRAINT "Poa_contralor_id_fkey" FOREIGN KEY ("contralor_id") REFERENCES "Contralor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poa" ADD CONSTRAINT "Poa_centro_id_fkey" FOREIGN KEY ("centro_id") REFERENCES "CentroUniversitario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_poa_id_fkey" FOREIGN KEY ("poa_id") REFERENCES "Poa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_banco_actividad_id_fkey" FOREIGN KEY ("banco_actividad_id") REFERENCES "BancoActividad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadAuditor" ADD CONSTRAINT "ActividadAuditor_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "Actividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadAuditor" ADD CONSTRAINT "ActividadAuditor_auditor_id_fkey" FOREIGN KEY ("auditor_id") REFERENCES "Auditor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubActividad" ADD CONSTRAINT "SubActividad_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "Actividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubActividad" ADD CONSTRAINT "SubActividad_banco_sub_actividad_id_fkey" FOREIGN KEY ("banco_sub_actividad_id") REFERENCES "BancoSubActividad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
