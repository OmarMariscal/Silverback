import { PrismaClient } from '../src/prisma/generated/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando la siembra de datos (Seeding)...');

  // ==========================================
  // 0. LIMPIEZA DE BASE DE DATOS
  // ==========================================
  console.log('🧹 Limpiando registros anteriores...');
  await prisma.subActividad.deleteMany();
  await prisma.actividadAuditor.deleteMany();
  await prisma.actividad.deleteMany();
  await prisma.poa.deleteMany();
  await prisma.bancoActividad.deleteMany();

  await prisma.auditor.deleteMany();
  await prisma.contralor.deleteMany();
  await prisma.jefa.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.centroUniversitario.deleteMany();

  // ==========================================
  // 1. PREPARAR CONTRASEÑA GLOBAL
  // ==========================================
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  console.log(
    '🔑 Contraseña encriptada generada para todos los usuarios: Admin123!',
  );

  // ==========================================
  // 2. CREACIÓN DE CENTROS UNIVERSITARIOS
  // ==========================================
  console.log('🏫 Creando Centros Universitarios...');
  const cucei = await prisma.centroUniversitario.create({
    data: {
      clave: 'CUCEI',
      nombre: 'Centro Universitario de Ciencias Exactas e Ingenierías',
    },
  });
  const cucs = await prisma.centroUniversitario.create({
    data: {
      clave: 'CUCS',
      nombre: 'Centro Universitario de Ciencias de la Salud',
    },
  });
  const cucba = await prisma.centroUniversitario.create({
    data: {
      clave: 'CUCBA',
      nombre: 'Centro Universitario de Ciencias Biológicas y Agropecuarias',
    },
  });
  const cuvalles = await prisma.centroUniversitario.create({
    data: { clave: 'CUVALLES', nombre: 'Centro Universitario de los Valles' },
  });

  // ==========================================
  // 3. CREACIÓN DEL ELENCO DE USUARIOS
  // ==========================================
  console.log('👥 Creando usuarios y asignando roles...');

  const jefa = await prisma.usuario.create({
    data: {
      nombre_completo: 'Dra. Titular de la Contraloría',
      correo: 'jefa@contraloria.udg.mx',
      password_encriptada: passwordHash,
      rol: 'JEFA',
      jefa: { create: {} },
    },
    include: { jefa: true },
  });

  const contralorCucei = await prisma.usuario.create({
    data: {
      nombre_completo: 'Mtro. Contralor CUCEI',
      correo: 'contralor.cucei@udg.mx',
      password_encriptada: passwordHash,
      rol: 'CONTRALOR',
      contralor: {
        create: { centro_id: cucei.id, jefa_id: jefa.jefa!.id },
      },
    },
    include: { contralor: true },
  });

  const contralorCuvalles = await prisma.usuario.create({
    data: {
      nombre_completo: 'Lic. Contralora CUVALLES',
      correo: 'contralor.cuvalles@udg.mx',
      password_encriptada: passwordHash,
      rol: 'CONTRALOR',
      contralor: {
        create: { centro_id: cuvalles.id, jefa_id: jefa.jefa!.id },
      },
    },
    include: { contralor: true },
  });

  await prisma.usuario.create({
    data: {
      nombre_completo: 'Lic. Auditor Auxiliar',
      correo: 'auditor.auxiliar@udg.mx',
      password_encriptada: passwordHash,
      rol: 'AUDITOR',
      auditor: { create: { contralor_id: contralorCucei.contralor!.id } },
    },
  });

  await prisma.usuario.create({
    data: {
      nombre_completo: 'Mtro. Auditor Titular',
      correo: 'auditor.titular@udg.mx',
      password_encriptada: passwordHash,
      rol: 'AUDITOR',
      auditor: { create: { contralor_id: contralorCucei.contralor!.id } },
    },
  });

  // ==========================================
  // 4. CREACIÓN DEL BANCO DE ACTIVIDADES
  // ==========================================
  console.log('🗂️ Creando Catálogo del Banco de Actividades...');

  await prisma.bancoActividad.createMany({
    data: [
      {
        tipo: 'AUDITORIA',
        titulo: 'Revisión al rubro de Obra Pública',
        justificacion_plantilla:
          'Verificar el adecuado cumplimiento a los procedimientos relativos a la planeación, programación, presupuestación, contratación, gasto, ejecución y control de las obras públicas y servicios relacionados, asegurando la transparencia y normativa aplicable de la Universidad.',
        objetivo_gen_plantilla:
          'Asegurar la correcta aplicación de los recursos destinados a la obra pública, así como de los servicios relacionados con las mismas, verificando el cumplimiento estricto a la legislación universitaria y contratos establecidos.',
        objetivos_part_plantilla:
          '- Revisión de expedientes técnicos.\n- Inspección física de los avances de obra.\n- Verificación de bitácoras y estimaciones.',
        metas_plantilla:
          'Emisión de 1 Informe de Auditoría y Cédula de Observaciones correspondientes.',
      },
      {
        tipo: 'REVISION',
        titulo: 'Revisión de asistencia del Personal Académico',
        justificacion_plantilla:
          'Confirmar la asistencia del personal Académico mediante una inspección física y documental, para garantizar la calidad educativa y el cumplimiento de las cargas horarias asignadas en el Centro Universitario.',
        objetivo_gen_plantilla:
          'Validar que el personal docente cumpla con sus horarios de clase registrados en el sistema integral, identificando incidencias, retardos o ausencias injustificadas.',
        objetivos_part_plantilla:
          '- Realizar recorridos aleatorios en aulas.\n- Cotejar firmas de asistencia con el reporte de nómina.\n- Elaborar actas administrativas en caso de incumplimiento recurrente.',
        metas_plantilla:
          'Cubrir la revisión del 100% de la plantilla académica activa durante el ciclo escolar vigente.',
      },
      {
        tipo: 'REVISION',
        titulo: 'Desincorporación de bienes muebles',
        justificacion_plantilla:
          'Atender el rezago físico y contable de los bienes que ya no son útiles para el desarrollo de las actividades del Centro Universitario, procediendo a su baja oficial del patrimonio.',
        objetivo_gen_plantilla:
          'Verificar física y documentalmente el estado de los bienes propuestos para desincorporación, asegurando que el dictamen técnico justifique su obsolescencia o daño irreparable.',
        objetivos_part_plantilla:
          '- Clasificar los bienes propuestos.\n- Cotejar contra resguardos oficiales.\n- Supervisar la recolección y entrega final al almacén central.',
        metas_plantilla:
          'Desincorporar los equipos dictaminados dentro de los plazos establecidos por el comité de patrimonio.',
      },
    ],
  });

  console.log('✅ ¡Siembra de datos finalizada con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la siembra de datos:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerramos el pool de Postgres limpiamente
    await pool.end();
  });
