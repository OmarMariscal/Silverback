-- CreateEnum
CREATE TYPE "EstadoDictamen" AS ENUM ('EN_REVISION', 'DEVUELTA_CON_OBSERVACIONES', 'APROBADA');

-- CreateEnum
CREATE TYPE "EstadoSolvencia" AS ENUM ('PENDIENTE', 'NO_SOLVENTADA', 'PARCIALMENTE_SOLVENTADA', 'SOLVENTADA');

-- CreateEnum
CREATE TYPE "EstadoArchivoEvidencia" AS ENUM ('PENDIENTE', 'BORRADOR', 'ENVIADO');

-- CreateTable
CREATE TABLE "EntregaSubActividad" (
    "id" TEXT NOT NULL,
    "sub_actividad_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "estado_dictamen" "EstadoDictamen" NOT NULL DEFAULT 'EN_REVISION',
    "comentarios_entrega" TEXT,
    "fecha_envio" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_dictamen" TIMESTAMPTZ,

    CONSTRAINT "EntregaSubActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidencia" (
    "id" TEXT NOT NULL,
    "sub_actividad_id" TEXT NOT NULL,
    "entrega_id" TEXT,
    "nombre_original" TEXT NOT NULL,
    "s3_key" TEXT NOT NULL,
    "peso_bytes" INTEGER NOT NULL,
    "tipo_mime" TEXT NOT NULL,
    "estado" "EstadoArchivoEvidencia" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observacion" (
    "id" TEXT NOT NULL,
    "entrega_id" TEXT NOT NULL,
    "numero_secuencia" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado_solvencia" "EstadoSolvencia" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Observacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntregaSubActividad_sub_actividad_id_idx" ON "EntregaSubActividad"("sub_actividad_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntregaSubActividad_sub_actividad_id_version_key" ON "EntregaSubActividad"("sub_actividad_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Evidencia_s3_key_key" ON "Evidencia"("s3_key");

-- CreateIndex
CREATE INDEX "Evidencia_sub_actividad_id_estado_idx" ON "Evidencia"("sub_actividad_id", "estado");

-- CreateIndex
CREATE INDEX "Evidencia_entrega_id_idx" ON "Evidencia"("entrega_id");

-- CreateIndex
CREATE INDEX "Evidencia_estado_fecha_creacion_idx" ON "Evidencia"("estado", "fecha_creacion");

-- CreateIndex
CREATE INDEX "Observacion_entrega_id_idx" ON "Observacion"("entrega_id");

-- AddForeignKey
ALTER TABLE "EntregaSubActividad" ADD CONSTRAINT "EntregaSubActividad_sub_actividad_id_fkey" FOREIGN KEY ("sub_actividad_id") REFERENCES "SubActividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia" ADD CONSTRAINT "Evidencia_sub_actividad_id_fkey" FOREIGN KEY ("sub_actividad_id") REFERENCES "SubActividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidencia" ADD CONSTRAINT "Evidencia_entrega_id_fkey" FOREIGN KEY ("entrega_id") REFERENCES "EntregaSubActividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observacion" ADD CONSTRAINT "Observacion_entrega_id_fkey" FOREIGN KEY ("entrega_id") REFERENCES "EntregaSubActividad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
