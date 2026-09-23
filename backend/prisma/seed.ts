import {
  PrismaClient,
  TipoActividad,
  Prisma,
  EstadoSubActividad,
  EstadoPoa,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool) as any;
const prisma = new PrismaClient({ adapter });

// ==========================================
// FUNCIONES DE UTILIDAD (REGLAS DE NEGOCIO)
// ==========================================
const getRandomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const getRandomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const diffWeeks = (d1: Date, d2: Date) =>
  Math.max(
    1,
    Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 7)),
  );

// Regla matemática del dominio para el ordenamiento
const calcularIndiceOrden = (orden: string): number => {
  if (!orden) return 0;
  const partes = orden.split('.');
  const mayor = parseInt(partes[0] || '0', 10);
  const menor = parseInt(partes[1] || '0', 10);
  return (isNaN(mayor) ? 0 : mayor * 1000) + (isNaN(menor) ? 0 : menor);
};

async function main() {
  console.log('🚀 Iniciando la Súper Siembra de Datos (Seeding masivo)...');

  console.log(
    '🧹 Purificando la base de datos (Orden de dependencias seguro)...',
  );
  await prisma.subActividad.deleteMany();
  await prisma.actividadAuditor.deleteMany();
  await prisma.actividad.deleteMany();
  await prisma.poa.deleteMany();
  await prisma.bancoSubActividad.deleteMany();
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
  await prisma.centroUniversitario.create({
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

  console.log(
    '🗂️ Llenando el Catálogo del Banco de Actividades con Indicadores y Metas...',
  );
  const plantillasData: Prisma.BancoActividadCreateInput[] = [
    {
      titulo: 'Revisión al rubro de Obra Pública',
      justificacion_plantilla:
        'Verificar el adecuado cumplimiento de la normatividad en obras.',
      objetivo_gen_plantilla:
        'Asegurar la correcta aplicación de los recursos asignados a infraestructura.',
      objetivos_part_plantilla:
        '- Revisión de expedientes técnicos.\n- Inspección física de avances.',
      metas_plantilla:
        'Emisión de 1 Informe de revisión de obra pública por trimestre.',
      indicadores:
        'Porcentaje de expedientes auditados vs programados (Meta: 100%).',
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
      justificacion_plantilla:
        'Confirmar la asistencia y puntualidad del personal docente.',
      objetivo_gen_plantilla:
        'Validar que el personal cumpla con su carga horaria asignada.',
      objetivos_part_plantilla:
        '- Recorridos aleatorios en centros de trabajo.\n- Cruce con checadores biométricos.',
      metas_plantilla:
        'Revisión del 100% de la plantilla docente del centro universitario.',
      indicadores:
        'Índice de cumplimiento de asistencia docente (Meta: >= 95%).',
      sub_actividades_sugeridas: {
        create: [
          {
            descripcion: 'Recolección de firmas y listas',
            tipo_sugerido: TipoActividad.REVISION,
          },
          {
            descripcion: 'Cruce contra nómina y incidencias',
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

  console.log('🏭 Fabricando POA y 15 Actividades con consistencia total...');
  const faprobado = getRandomDate(
    new Date('2026-01-02'),
    new Date('2026-01-31'),
  );

  const totalActividades = 15;

  const poaCucei2026 = await prisma.poa.create({
    data: {
      anio_fiscal: 2026,
      estado: EstadoPoa.AUTORIZADO,
      contralor_id: contralorCucei.contralor!.id,
      centro_id: cucei.id,
      fecha_aprobado: faprobado,
      mensaje_resolucion: 'POA aprobado tras revisión inicial por la Jefatura.',
      ultima_secuencia_actividad: totalActividades,
    },
  });

  const auditoresDisponibles = [
    auditorAuxiliar.auditor!.id,
    auditorTitular.auditor!.id,
  ];

  const titulosPropios = [
    'Auditoría a Caja Chica',
    'Revisión de Viáticos Extraordinarios',
    'Inspección de Equipo de Cómputo',
  ];
  const subTareasPropias = [
    'Entrevista con el responsable del área',
    'Levantamiento fotográfico de evidencias',
    'Elaboración y firma de acta circunstanciada',
  ];

  for (let i = 1; i <= totalActividades; i++) {
    const fInicio = getRandomDate(
      new Date('2026-01-01'),
      new Date('2026-06-01'),
    );
    const fFin = getRandomDate(new Date('2026-06-02'), new Date('2026-12-31'));
    const folioStr = String(i).padStart(3, '0');
    const folioNumerico = parseInt(folioStr, 10);

    const vieneDelBanco = Math.random() < 0.7;
    let nuevaActividad;
    let subIndex = 1;

    // Función auxiliar para calcular estados y asegurar fecha de envío si aplica
    // Función auxiliar para calcular estados y asegurar fecha de envío si aplica
    const generarDatosSubactividad = (
      subInicio: Date,
      subFin: Date,
      bancoSubId: string | null,
      descripcion: string,
      tipo: TipoActividad,
    ) => {
      const estadosPosibles = Object.values(EstadoSubActividad);
      const estadoOperativo = getRandomElement(estadosPosibles);

      // REGLA DE NEGOCIO: Si está en revisión, devuelta o concluida, debe tener fecha de envío lógica
      let fechaEnvio: Date | null = null;

      // 🛠️ Solución: Forzamos el tipo con aserción para evitar el conflicto de TypeScript
      const estadosConEnvio: string[] = [
        EstadoSubActividad.EN_REVISION,
        EstadoSubActividad.DEVUELTA,
        EstadoSubActividad.CONCLUIDA,
      ];

      if (estadosConEnvio.includes(estadoOperativo)) {
        fechaEnvio = getRandomDate(subInicio, subFin);
      }

      const numeroOrden = `${folioNumerico}.${subIndex++}`;

      return {
        actividad_id: '', // Se asigna después de crear la actividad padre
        banco_sub_actividad_id: bancoSubId,
        numero_orden: numeroOrden,
        indice_orden: calcularIndiceOrden(numeroOrden),
        descripcion_tarea: descripcion,
        estado_operativo: estadoOperativo,
        fecha_inicio: subInicio,
        fecha_termino: subFin,
        fecha_envio: fechaEnvio,
        semanas_totales: diffWeeks(subInicio, subFin),
        tipo: tipo,
      };
    };

    if (vieneDelBanco) {
      const plantilla = getRandomElement(catalogo);
      nuevaActividad = await prisma.actividad.create({
        data: {
          poa_id: poaCucei2026.id,
          banco_actividad_id: plantilla.id,
          folio: folioStr,
          titulo: plantilla.titulo,
          justificacion:
            (plantilla.justificacion_plantilla || '') +
            ` (Adaptación institucional #${i})`,
          objetivo_general: plantilla.objetivo_gen_plantilla || '',
          objetivos_part: plantilla.objetivos_part_plantilla || '',
          meta_proyecto:
            plantilla.metas_plantilla ||
            'Cumplimiento de metas institucionales.',
          indicadores:
            plantilla.indicadores || 'Indicador estándar de auditoría interna.',
          fecha_inicio: fInicio,
          fecha_termino: fFin,
          porcentaje_global: Math.floor(Math.random() * 100),
          es_rezago: false,
        },
      });

      // Subactividades desde el banco
      for (const subSugerida of plantilla.sub_actividades_sugeridas) {
        const subInicio = getRandomDate(
          fInicio,
          new Date(
            fInicio.getTime() + (fFin.getTime() - fInicio.getTime()) / 2,
          ),
        );
        const subFin = getRandomDate(subInicio, fFin);

        const dataSub = generarDatosSubactividad(
          subInicio,
          subFin,
          subSugerida.id,
          subSugerida.descripcion,
          subSugerida.tipo_sugerido,
        );
        dataSub.actividad_id = nuevaActividad.id;

        await prisma.subActividad.create({ data: dataSub });
      }

      // Subactividad adicional creada por el auditor de forma manual
      if (Math.random() > 0.5) {
        const subInicio = getRandomDate(fInicio, fFin);
        const subFin = getRandomDate(subInicio, fFin);

        const dataSub = generarDatosSubactividad(
          subInicio,
          subFin,
          null,
          getRandomElement(subTareasPropias),
          TipoActividad.REVISION,
        );
        dataSub.actividad_id = nuevaActividad.id;

        await prisma.subActividad.create({ data: dataSub });
      }
    } else {
      // Actividad 100% propia sin plantilla
      nuevaActividad = await prisma.actividad.create({
        data: {
          poa_id: poaCucei2026.id,
          banco_actividad_id: null,
          folio: folioStr,
          titulo: getRandomElement(titulosPropios) + ` #${i}`,
          justificacion:
            'Justificación detallada y elaborada manualmente por el auditor asignado.',
          objetivo_general:
            'Objetivo general específico detectado durante la planeación operativa.',
          objetivos_part:
            '- Análisis preliminar de riesgos.\n- Integración de papeles de trabajo.',
          meta_proyecto:
            'Conclusión de la revisión especial con su respectivo dictamen.',
          indicadores:
            'Porcentaje de avance en la solventación de observaciones (Meta: 100%).',
          fecha_inicio: fInicio,
          fecha_termino: fFin,
          porcentaje_global: Math.floor(Math.random() * 100),
          es_rezago: false,
        },
      });

      for (let j = 0; j < 2; j++) {
        const subInicio = getRandomDate(
          fInicio,
          new Date(
            fInicio.getTime() + (fFin.getTime() - fInicio.getTime()) / 2,
          ),
        );
        const subFin = getRandomDate(subInicio, fFin);

        const dataSub = generarDatosSubactividad(
          subInicio,
          subFin,
          null,
          getRandomElement(subTareasPropias),
          getRandomElement([TipoActividad.AUDITORIA, TipoActividad.REVISION]),
        );
        dataSub.actividad_id = nuevaActividad.id;

        await prisma.subActividad.create({ data: dataSub });
      }
    }

    // Asignar auditores de forma aleatoria
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
  }

  console.log(
    '✅ ¡Siembra de datos optimizada y enriquecida con éxito absoluto!',
  );
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
