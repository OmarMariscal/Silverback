import {
  PrismaClient,
  TipoActividad,
  Prisma,
  EstadoSubActividad,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool) as any;
const prisma = new PrismaClient({ adapter });

// Funciones de utilidad globales
const getRandomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const getRandomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const diffWeeks = (d1: Date, d2: Date) =>
  Math.max(
    1,
    Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 7)),
  );

async function main() {
  console.log('🚀 Iniciando la Súper Siembra de Datos (Seeding masivo)...');

  console.log(
    '🧹 Purificando la base de datos (Orden de dependencias seguro)...',
  );
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

  const passwordHash = await bcrypt.hash('Admin123!', 10);
  console.log('🔑 Contraseña universal generada: Admin123!');

  console.log('🏫 Construyendo infraestructura de Centros Universitarios...');
  const cucei = await prisma.centroUniversitario.create({
    data: {
      clave: 'CUCEI',
      nombre: 'Centro Universitario de Ciencias Exactas e Ingenierías',
    },
  });
  const cuvalles = await prisma.centroUniversitario.create({
    data: { clave: 'CUVALLES', nombre: 'Centro Universitario de los Valles' },
  });

  console.log('👥 Reclutando personal (Jefatura, Contralores y Auditores)...');
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
      contralor: { create: { centro_id: cucei.id, jefa_id: jefa.jefa!.id } },
    },
    include: { contralor: true },
  });

  const contralorCuvalles = await prisma.usuario.create({
    data: {
      nombre_completo: 'Lic. Contralora CUVALLES',
      correo: 'contralor.cuvalles@udg.mx',
      password_encriptada: passwordHash,
      rol: 'CONTRALOR',
      contralor: { create: { centro_id: cuvalles.id, jefa_id: jefa.jefa!.id } },
    },
    include: { contralor: true },
  });

  const auditorAuxiliar = await prisma.usuario.create({
    data: {
      nombre_completo: 'Lic. Auditor Auxiliar',
      correo: 'auditor.auxiliar@udg.mx',
      password_encriptada: passwordHash,
      rol: 'AUDITOR',
      auditor: { create: { contralor_id: contralorCucei.contralor!.id } },
    },
    include: { auditor: true },
  });

  const auditorTitular = await prisma.usuario.create({
    data: {
      nombre_completo: 'Mtro. Auditor Titular',
      correo: 'auditor.titular@udg.mx',
      password_encriptada: passwordHash,
      rol: 'AUDITOR',
      auditor: { create: { contralor_id: contralorCucei.contralor!.id } },
    },
    include: { auditor: true },
  });

  console.log('🗂️ Llenando el Catálogo del Banco de Actividades...');
  const plantillasData: Prisma.BancoActividadCreateInput[] = [
    {
      titulo: 'Revisión al rubro de Obra Pública',
      justificacion_plantilla: 'Verificar el adecuado cumplimiento...',
      objetivo_gen_plantilla: 'Asegurar la correcta aplicación...',
      objetivos_part_plantilla: '- Revisión de expedientes...',
      metas_plantilla: 'Emisión de 1 Informe...',
      sub_actividades_sugeridas: {
        create: [
          {
            descripcion: 'Fase de Planeación y Documentación',
            tipo_sugerido: TipoActividad.AUDITORIA,
          },
          {
            descripcion: 'Inspección Física de Obra',
            tipo_sugerido: TipoActividad.AUDITORIA,
          },
        ],
      },
    },
    {
      titulo: 'Revisión de asistencia del Personal Académico',
      justificacion_plantilla: 'Confirmar la asistencia del personal...',
      objetivo_gen_plantilla: 'Validar que el personal docente cumpla...',
      objetivos_part_plantilla: '- Recorridos aleatorios...',
      metas_plantilla: 'Revisión del 100% de la plantilla...',
      sub_actividades_sugeridas: {
        create: [
          {
            descripcion: 'Recolección de firmas',
            tipo_sugerido: TipoActividad.REVISION,
          },
          {
            descripcion: 'Cruce contra nómina',
            tipo_sugerido: TipoActividad.REVISION,
          },
        ],
      },
    },
    {
      titulo: 'Desincorporación de bienes muebles',
      justificacion_plantilla: 'Atender el rezago físico y contable...',
      objetivo_gen_plantilla: 'Verificar física y documentalmente el estado...',
      objetivos_part_plantilla: '- Clasificar bienes...',
      metas_plantilla: 'Desincorporar los equipos...',
      sub_actividades_sugeridas: {
        create: [
          {
            descripcion: 'Levantamiento de inventario',
            tipo_sugerido: TipoActividad.REVISION,
          },
        ],
      },
    },
    {
      titulo: 'Auditoría a Ingresos Autogenerados',
      justificacion_plantilla: 'Evaluar la captación de recursos propios...',
      objetivo_gen_plantilla:
        'Transparentar el uso de recursos autogenerados...',
      objetivos_part_plantilla: '- Revisión de recibos...',
      metas_plantilla: '1 Dictamen financiero...',
      sub_actividades_sugeridas: {
        create: [
          {
            descripcion: 'Auditoría de cuentas bancarias',
            tipo_sugerido: TipoActividad.AUDITORIA,
          },
          {
            descripcion: 'Revisión de recibos de ingresos',
            tipo_sugerido: TipoActividad.REVISION,
          },
        ],
      },
    },
  ];

  type BancoActividadConSugerencias = Prisma.BancoActividadGetPayload<{
    include: { sub_actividades_sugeridas: true };
  }>;

  const catalogo: BancoActividadConSugerencias[] = await Promise.all(
    plantillasData.map((p) =>
      prisma.bancoActividad.create({
        data: p,
        include: { sub_actividades_sugeridas: true },
      }),
    ),
  );

  console.log('🏭 Fabricando POA y 15 Actividades aleatorias para CUCEI...');
  const faprobado = getRandomDate(
    new Date('2026-01-02'),
    new Date('2026-01-31'),
  );
  const poaCucei2026 = await prisma.poa.create({
    data: {
      anio_fiscal: 2026,
      estado: 'AUTORIZADO',
      contralor_id: contralorCucei.contralor!.id,
      fecha_aprobado: faprobado,
    },
  });

  // 2. Actualiza el arreglo con tus 6 nuevos estados usando el enum nativo
  const estadosOperativos: EstadoSubActividad[] = [
    EstadoSubActividad.SIN_EMPEZAR,
    EstadoSubActividad.SOLICITADO,
    EstadoSubActividad.EN_PROGRESO,
    EstadoSubActividad.EN_REVISION,
    EstadoSubActividad.DEVUELTA,
    EstadoSubActividad.CONCLUIDA,
  ];

  const auditoresDisponibles = [
    auditorAuxiliar.auditor!.id,
    auditorTitular.auditor!.id,
  ];

  for (let i = 1; i <= 15; i++) {
    const plantilla = getRandomElement(catalogo);
    const fInicio = getRandomDate(
      new Date('2026-01-01'),
      new Date('2026-06-01'),
    );
    const fFin = getRandomDate(new Date('2026-06-02'), new Date('2026-12-31'));
    const folioStr = String(i).padStart(3, '0');

    const nuevaActividad = await prisma.actividad.create({
      data: {
        poa_id: poaCucei2026.id,
        banco_actividad_id: plantilla.id,
        folio: folioStr,
        titulo: plantilla.titulo,
        justificacion:
          (plantilla.justificacion_plantilla || '') + ` (Adaptación #${i})`,
        objetivo_general: plantilla.objetivo_gen_plantilla || '',
        objetivos_part: plantilla.objetivos_part_plantilla || '',
        fecha_inicio: fInicio,
        fecha_termino: fFin,
        porcentaje_global: Math.floor(Math.random() * 100),
        es_rezago: false,
      },
    });

    const cantidadAuditores =
      Math.floor(Math.random() * auditoresDisponibles.length) + 1;
    const auditoresAsignados = [...auditoresDisponibles]
      .sort(() => 0.5 - Math.random())
      .slice(0, cantidadAuditores);

    for (const auditorId of auditoresAsignados) {
      await prisma.actividadAuditor.create({
        data: {
          actividad_id: nuevaActividad.id,
          auditor_id: auditorId,
        },
      });
    }

    if (plantilla.sub_actividades_sugeridas) {
      let subIndex = 1;
      for (const subSugerida of plantilla.sub_actividades_sugeridas) {
        const subInicio = getRandomDate(
          fInicio,
          new Date(
            fInicio.getTime() + (fFin.getTime() - fInicio.getTime()) / 2,
          ),
        );
        const subFin = getRandomDate(subInicio, fFin);
        const semanas = diffWeeks(subInicio, subFin);

        await prisma.subActividad.create({
          data: {
            actividad_id: nuevaActividad.id,
            numero_orden: `1.${subIndex++}`,
            descripcion_tarea: subSugerida.descripcion,
            estado_operativo: getRandomElement(estadosOperativos),
            mensaje_observacion: null,
            fecha_inicio: subInicio,
            fecha_termino: subFin,
            semanas_totales: semanas,
            tipo: subSugerida.tipo_sugerido,
          },
        });
      }
    }
  }

  console.log('✅ ¡Siembra de datos finalizada con éxito absoluto!');
}

main()
  .catch((e) => {
    console.error('❌ Error fatal en el proceso de Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
