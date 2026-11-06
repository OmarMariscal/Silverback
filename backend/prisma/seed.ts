import 'dotenv/config';
import {
  PrismaClient,
  RolUsuario,
  TipoActividad,
  EstadoPoa,
  EstadoSubActividad,
  EstadoDictamen,
  EstadoSolvencia,
  EstadoArchivoEvidencia,
  Prisma,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'crypto';

// ==========================================
// CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS
// ==========================================
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool) as any;
const prisma = new PrismaClient({ adapter });

// ==========================================
// FUNCIONES DE UTILIDAD (REGLAS DE NEGOCIO Y FECHAS)
// ==========================================
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const subDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const getRandomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const diffWeeks = (d1: Date, d2: Date): number =>
  Math.max(
    1,
    Math.round(
      Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 7),
    ),
  );

/**
 * Regla matemática del dominio Silverback para ordenamiento jerárquico.
 * Convierte "01.02" o "1.2" en un número ponderado (1 * 1000 + 2 = 1002).
 */
const calcularIndiceOrden = (orden: string): number => {
  if (!orden) return 0;
  const partes = orden.split('.');
  const mayor = parseInt(partes[0] || '0', 10);
  const menor = parseInt(partes[1] || '0', 10);
  return (isNaN(mayor) ? 0 : mayor * 1000) + (isNaN(menor) ? 0 : menor);
};

async function main() {
  console.log('🚀 Iniciando siembra maestra de Silverback (Contraloría)...');
  const hoy = new Date();
  const anioActual = hoy.getFullYear();
  const anioAnterior = anioActual - 1;

  // =========================================================================
  // PASO 1: LIMPIEZA DE BASE DE DATOS (ORDEN INVERSO ESTRICTO POR LLAVES FORÁNEAS)
  // =========================================================================
  console.log('🧹 Limpiando base de datos en orden inverso de dependencias...');
  await prisma.observacion.deleteMany();
  await prisma.evidencia.deleteMany();
  await prisma.entregaSubActividad.deleteMany();
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

  // =========================================================================
  // PASO 2: GENERACIÓN DE CONTRASEÑA UNIVERSAL
  // =========================================================================
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  console.log('🔑 Contraseña base generada para todos los usuarios: Admin123!');

  // =========================================================================
  // PASO 3: CREACIÓN DE CENTROS UNIVERSITARIOS
  // =========================================================================
  console.log('🏫 Creando Centros Universitarios (CUCEI, CUVALLES, CUCS, CUCEA)...');
  const cucei = await prisma.centroUniversitario.create({
    data: {
      clave: 'CUCEI',
      nombre: 'Centro Universitario de Ciencias Exactas e Ingenierías',
    },
  });

  const cuvalles = await prisma.centroUniversitario.create({
    data: {
      clave: 'CUVALLES',
      nombre: 'Centro Universitario de los Valles',
    },
  });

  const cucs = await prisma.centroUniversitario.create({
    data: {
      clave: 'CUCS',
      nombre: 'Centro Universitario de Ciencias de la Salud',
    },
  });

  const cucea = await prisma.centroUniversitario.create({
    data: {
      clave: 'CUCEA',
      nombre: 'Centro Universitario de Ciencias Económico Administrativas',
    },
  });

  // =========================================================================
  // PASO 4: ESTRUCTURA ORGANIZACIONAL (JEFA, CONTRALORES Y AUDITORES)
  // =========================================================================
  console.log('👥 Creando personal institucional (Jefatura, Contralores y Auditores)...');

  // 1 Jefa General que supervisa a todos los contralores
  const usuarioJefa = await prisma.usuario.create({
    data: {
      id: '11111111-1111-4111-8111-111111111111',
      nombre_completo: 'Dra. Carmen Patricia Rosas López',
      correo: 'jefa@contraloria.udg.mx',
      password_encriptada: passwordHash,
      rol: RolUsuario.JEFA,
      jefa: { create: {} },
    },
    include: { jefa: true },
  });
  const jefaId = usuarioJefa.jefa!.id;

  // 3 Contralores (uno por cada centro universitario principal)
  const usuarioContralorCucei = await prisma.usuario.create({
    data: {
      id: 'a8f99f0d-c949-4feb-b849-44a5305e2f45',
      nombre_completo: 'Mtro. Héctor Alejandro Navarro Gómez',
      correo: 'contralor.cucei@udg.mx',
      password_encriptada: passwordHash,
      rol: RolUsuario.CONTRALOR,
      contralor: {
        create: {
          centro_id: cucei.id,
          jefa_id: jefaId,
        },
      },
    },
    include: { contralor: true },
  });

  const usuarioContralorCuvalles = await prisma.usuario.create({
    data: {
      id: 'b8f99f0d-c949-4feb-b849-44a5305e2f46',
      nombre_completo: 'Mtra. Sofía Morales Castañeda',
      correo: 'contralor.cuvalles@udg.mx',
      password_encriptada: passwordHash,
      rol: RolUsuario.CONTRALOR,
      contralor: {
        create: {
          centro_id: cuvalles.id,
          jefa_id: jefaId,
        },
      },
    },
    include: { contralor: true },
  });

  const usuarioContralorCucs = await prisma.usuario.create({
    data: {
      id: 'c8f99f0d-c949-4feb-b849-44a5305e2f47',
      nombre_completo: 'Dr. Roberto Mendoza Alatorre',
      correo: 'contralor.cucs@udg.mx',
      password_encriptada: passwordHash,
      rol: RolUsuario.CONTRALOR,
      contralor: {
        create: {
          centro_id: cucs.id,
          jefa_id: jefaId,
        },
      },
    },
    include: { contralor: true },
  });

  // Auditores operativos
  const usuarioAuditor1Cucei = await prisma.usuario.create({
    data: {
      id: '22222222-2222-4222-8222-222222222222',
      nombre_completo: 'Lic. Fernando Gómez Ortiz',
      correo: 'auditor.cucei1@udg.mx',
      password_encriptada: passwordHash,
      rol: RolUsuario.AUDITOR,
      auditor: {
        create: { contralor_id: usuarioContralorCucei.contralor!.id },
      },
    },
    include: { auditor: true },
  });

  const usuarioAuditor2Cucei = await prisma.usuario.create({
    data: {
      id: '33333333-3333-4333-8333-333333333333',
      nombre_completo: 'Lic. Mariana Vargas Gil',
      correo: 'auditor.cucei2@udg.mx',
      password_encriptada: passwordHash,
      rol: RolUsuario.AUDITOR,
      auditor: {
        create: { contralor_id: usuarioContralorCucei.contralor!.id },
      },
    },
    include: { auditor: true },
  });

  const usuarioAuditorCuvalles = await prisma.usuario.create({
    data: {
      id: '44444444-4444-4444-8444-444444444444',
      nombre_completo: 'Lic. Jorge Alberto Ruiz Peña',
      correo: 'auditor.cuvalles@udg.mx',
      password_encriptada: passwordHash,
      rol: RolUsuario.AUDITOR,
      auditor: {
        create: { contralor_id: usuarioContralorCuvalles.contralor!.id },
      },
    },
    include: { auditor: true },
  });

  const usuarioAuditorCucs = await prisma.usuario.create({
    data: {
      id: '55555555-5555-4555-8555-555555555555',
      nombre_completo: 'Lic. Elena Patricia Flores Díaz',
      correo: 'auditor.cucs@udg.mx',
      password_encriptada: passwordHash,
      rol: RolUsuario.AUDITOR,
      auditor: {
        create: { contralor_id: usuarioContralorCucs.contralor!.id },
      },
    },
    include: { auditor: true },
  });

  const auditoresCucei = [
    usuarioAuditor1Cucei.auditor!.id,
    usuarioAuditor2Cucei.auditor!.id,
  ];

  // =========================================================================
  // PASO 5: BANCO DE ACTIVIDADES (PLANTILLAS Y SUB-ACTIVIDADES SUGERIDAS)
  // =========================================================================
  console.log('📚 Sembrando catálogo del Banco de Actividades...');
  const plantillasData: Prisma.BancoActividadCreateInput[] = [
    {
      titulo: 'Auditoría al Rubro de Obra Pública y Mantenimiento de Infraestructura',
      justificacion_plantilla:
        'Verificar el estricto apego a la normatividad institucional y federal en la ejecución y comprobación de obras universitarias.',
      objetivo_gen_plantilla:
        'Asegurar la debida aplicación de los recursos destinados a infraestructura y conservación de edificios.',
      objetivos_part_plantilla:
        '- Revisión de bases de licitación, contratos y convenios modificatorios.\n- Inspección ocular y verificación física de avances de obra.\n- Revisión de números generadores y finiquitos de obra.',
      metas_plantilla:
        'Emisión de 1 Informe integral de auditoría de obra pública por semestre.',
      indicadores:
        'Porcentaje de estimaciones auditadas vs tramitadas (Meta: 100%).',
      sub_actividades_sugeridas: {
        create: [
          {
            descripcion: 'Revisión documental de expedientes unitarios y contratos de obra',
            tipo_sugerido: TipoActividad.AUDITORIA,
          },
          {
            descripcion: 'Inspección física y levantamiento topográfico de obra en sitio',
            tipo_sugerido: TipoActividad.AUDITORIA,
          },
          {
            descripcion: 'Revisión y compulsa de números generadores y finiquitos',
            tipo_sugerido: TipoActividad.REVISION,
          },
        ],
      },
    },
    {
      titulo: 'Auditoría de Control Interno y Registro de Activo Fijo',
      justificacion_plantilla:
        'Garantizar la salvaguarda, correcta asignación y registro fidedigno de los bienes patrimoniales de la institución.',
      objetivo_gen_plantilla:
        'Constatar la existencia física y la vigencia de los resguardos de bienes muebles e instrumental científico.',
      objetivos_part_plantilla:
        '- Cotejo del padrón de inventarios contra el sistema contable institucional.\n- Verificación física aleatoria en laboratorios, aulas y oficinas.',
      metas_plantilla:
        'Revisión del 100% de los bienes de alto valor del centro universitario.',
      indicadores:
        'Tasa de bienes localizados y conciliados respecto al padrón oficial (Meta: >= 98%).',
      sub_actividades_sugeridas: {
        create: [
          {
            descripcion: 'Cruce del padrón de activo fijo contra registros en pólizas contables',
            tipo_sugerido: TipoActividad.REVISION,
          },
          {
            descripcion: 'Verificación física aleatoria con marbete y código QR en departamentos',
            tipo_sugerido: TipoActividad.AUDITORIA,
          },
        ],
      },
    },
    {
      titulo: 'Revisión de Asistencia y Cumplimiento de Carga Horaria del Personal Académico',
      justificacion_plantilla:
        'Confirmar que las cargas docentes asignadas se cumplan en tiempo y forma en las aulas y laboratorios.',
      objetivo_gen_plantilla:
        'Validar el cumplimiento de horarios frente a grupo y asesorías académicas estipuladas.',
      objetivos_part_plantilla:
        '- Cruce de reportes de reloj checador biométrico contra asignación oficial de materias.\n- Recorridos aleatorios de supervisión presencial.',
      metas_plantilla:
        'Auditar el 100% de las divisiones académicas durante el ciclo escolar vigente.',
      indicadores:
        'Índice de cumplimiento de asistencia académica (Meta: >= 95%).',
      sub_actividades_sugeridas: {
        create: [
          {
            descripcion: 'Extracción de registros biométricos y conciliación de incidencias',
            tipo_sugerido: TipoActividad.REVISION,
          },
          {
            descripcion: 'Supervisión presencial en aulas e integración de actas circunstanciadas',
            tipo_sugerido: TipoActividad.AUDITORIA,
          },
        ],
      },
    },
    {
      titulo: 'Auditoría Financiera al Manejo de Fondos Revolventes y Caja Chica',
      justificacion_plantilla:
        'Comprobar la debida aplicación, custodia y comprobación fiscal de los recursos asignados a fondos revolventes.',
      objetivo_gen_plantilla:
        'Asegurar el cumplimiento de los lineamientos del gasto menor y los límites fijados por la normativa.',
      objetivos_part_plantilla:
        '- Ejecución de arqueos sorpresivos de efectivo.\n- Validación de CFDI y comprobantes de gasto ante el SAT.',
      metas_plantilla:
        'Realizar al menos 2 arqueos a cada fondo revolvente durante el ejercicio.',
      indicadores:
        'Porcentaje de comprobaciones solventadas sin observación (Meta: 100%).',
      sub_actividades_sugeridas: {
        create: [
          {
            descripcion: 'Arqueo sorpresivo de efectivo y valores en custodia',
            tipo_sugerido: TipoActividad.AUDITORIA,
          },
          {
            descripcion: 'Validación fiscal y normativa de facturas y comprobaciones de gasto',
            tipo_sugerido: TipoActividad.REVISION,
          },
        ],
      },
    },
  ];

  const catalogoBanco = await Promise.all(
    plantillasData.map((item) =>
      prisma.bancoActividad.create({
        data: item,
        include: { sub_actividades_sugeridas: true },
      }),
    ),
  );

  // =========================================================================
  // PASO 6: CREACIÓN DE POAS (VARIEDAD DE AÑOS Y ESTADOS)
  // =========================================================================
  console.log('📋 Generando POAs institucionales...');

  // 1. POA CUCEI 2026: AUTORIZADO (POA Operativo Principal, en ejecución activa)
  const poaCucei2026 = await prisma.poa.create({
    data: {
      anio_fiscal: anioActual,
      estado: EstadoPoa.AUTORIZADO,
      contralor_id: usuarioContralorCucei.contralor!.id,
      centro_id: cucei.id,
      fecha_aprobado: subDays(hoy, 75),
      mensaje_resolucion:
        'Plan Operativo Anual 2026 autorizado formalmente por la Jefatura de Contraloría tras validar el apego a la metodología institucional.',
      ultima_secuencia_actividad: 8,
    },
  });

  // 2. POA CUCEI 2025: AUTORIZADO (Histórico para simular el Rezago)
  const poaCucei2025 = await prisma.poa.create({
    data: {
      anio_fiscal: anioAnterior,
      estado: EstadoPoa.AUTORIZADO,
      contralor_id: usuarioContralorCucei.contralor!.id,
      centro_id: cucei.id,
      fecha_aprobado: subDays(hoy, 430),
      mensaje_resolucion:
        'POA 2025 autorizado para su ejercicio en el año fiscal 2025.',
      ultima_secuencia_actividad: 2,
    },
  });

  // 3. POA CUVALLES 2026: EN_REVISION (Para probar vistas de revisión por la Jefa)
  const poaCuvalles2026 = await prisma.poa.create({
    data: {
      anio_fiscal: anioActual,
      estado: EstadoPoa.EN_REVISION,
      contralor_id: usuarioContralorCuvalles.contralor!.id,
      centro_id: cuvalles.id,
      fecha_aprobado: null,
      mensaje_resolucion: null,
      ultima_secuencia_actividad: 3,
    },
  });

  // 4. POA CUCS 2026: DEVUELTA (Para probar corrección de observaciones del POA)
  const poaCucs2026 = await prisma.poa.create({
    data: {
      anio_fiscal: anioActual,
      estado: EstadoPoa.DEVUELTA,
      contralor_id: usuarioContralorCucs.contralor!.id,
      centro_id: cucs.id,
      fecha_devolucion: subDays(hoy, 6),
      mensaje_resolucion:
        'Se devuelve la propuesta de POA 2026 debido a inconsistencias en la justificación de metas de laboratorios clínicos. Favor de subsanar los indicadores cuantitativos.',
      ultima_secuencia_actividad: 2,
    },
  });

  // =========================================================================
  // PASO 7: OPERACIÓN CUCEI 2026 (POA AUTORIZADO CON SEMÁFOROS Y ENTREGAS S3)
  // =========================================================================
  console.log('⚡ Construyendo Actividades y Subactividades operativas para CUCEI 2026...');

  // Helper para asignar auditores
  const asignarAuditores = async (actividadId: string, auditorIds: string[]) => {
    for (const audId of auditorIds) {
      await prisma.actividadAuditor.create({
        data: {
          actividad_id: actividadId,
          auditor_id: audId,
        },
      });
    }
  };

  // -------------------------------------------------------------------------
  // ACTIVIDAD 1: SEMÁFORO CRÍTICO (Vencida) - Caja Chica y Fondos Revolventes
  // -------------------------------------------------------------------------
  const act1Cucei = await prisma.actividad.create({
    data: {
      poa_id: poaCucei2026.id,
      folio: '001',
      titulo: 'Auditoría Financiera y Arqueo al Fondo Revolvente de Rectoría y Secretaría',
      justificacion:
        'Identificar posibles desviaciones en el uso de efectivo y falta de comprobantes fiscales.',
      objetivo_general:
        'Verificar que las erogaciones por fondo revolvente se apeguen al tabulador autorizado.',
      objetivos_part:
        '- Ejecución de arqueo de caja chica.\n- Revisión de firmas y timbrado SAT de facturas.',
      meta_proyecto: 'Concluir el 100% de la revisión del primer cuatrimestre.',
      indicadores: 'Porcentaje de partidas comprobadas debidamente.',
      fecha_inicio: subDays(hoy, 45),
      fecha_termino: subDays(hoy, 5), // CRÍTICO: Hoy > fecha_termino
      es_rezago: false,
      banco_actividad_id: catalogoBanco[3].id,
    },
  });
  await asignarAuditores(act1Cucei.id, [auditoresCucei[0]]);

  // Subactividad 1.1: DEVUELTA (Semáforo CRÍTICO: vencida hace 5 días)
  const sub1_1 = await prisma.subActividad.create({
    data: {
      actividad_id: act1Cucei.id,
      numero_orden: '1.1',
      indice_orden: calcularIndiceOrden('1.1'),
      descripcion_tarea: 'Arqueo sorpresivo de valores y corte de caja chica',
      estado_operativo: EstadoSubActividad.DEVUELTA,
      tipo: TipoActividad.AUDITORIA,
      fecha_inicio: subDays(hoy, 40),
      fecha_termino: subDays(hoy, 5), // CRÍTICO
      fecha_envio: subDays(hoy, 10),
      semanas_totales: diffWeeks(subDays(hoy, 40), subDays(hoy, 5)),
      banco_sub_actividad_id: catalogoBanco[3].sub_actividades_sugeridas[0].id,
    },
  });

  // Versión 1 DEVUELTA con observaciones pendientes y evidencias subidas a S3
  const entregaSub1_1_v1 = await prisma.entregaSubActividad.create({
    data: {
      sub_actividad_id: sub1_1.id,
      version: 1,
      estado_dictamen: EstadoDictamen.DEVUELTA_CON_OBSERVACIONES,
      comentarios_entrega:
        'Envío de papeles de trabajo y acta de arqueo de fondo revolvente correspondiente a enero-febrero.',
      fecha_envio: subDays(hoy, 10),
      fecha_dictamen: subDays(hoy, 6),
    },
  });

  await prisma.observacion.createMany({
    data: [
      {
        entrega_id: entregaSub1_1_v1.id,
        numero_secuencia: 1,
        descripcion:
          'El acta de arqueo no contiene la firma autógrafa del custodio del fondo revolvente en la hoja de cierre.',
        estado_solvencia: EstadoSolvencia.PENDIENTE,
      },
      {
        entrega_id: entregaSub1_1_v1.id,
        numero_secuencia: 2,
        descripcion:
          'Se detectó un faltante temporal de $3,500.00 MXN amparado únicamente con un vale provisional no autorizado.',
        estado_solvencia: EstadoSolvencia.NO_SOLVENTADA,
      },
    ],
  });

  await prisma.evidencia.createMany({
    data: [
      {
        sub_actividad_id: sub1_1.id,
        entrega_id: entregaSub1_1_v1.id,
        nombre_original: 'acta_arqueo_caja_chica_enero.pdf',
        s3_key: `cucei/2026/entregas/${randomUUID()}-acta_arqueo.pdf`,
        peso_bytes: 2341050,
        tipo_mime: 'application/pdf',
        estado: EstadoArchivoEvidencia.ENVIADO,
        fecha_creacion: subDays(hoy, 10),
      },
      {
        sub_actividad_id: sub1_1.id,
        entrega_id: entregaSub1_1_v1.id,
        nombre_original: 'cedula_conciliacion_efectivo.xlsx',
        s3_key: `cucei/2026/entregas/${randomUUID()}-cedula_conciliacion.xlsx`,
        peso_bytes: 945200,
        tipo_mime:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        estado: EstadoArchivoEvidencia.ENVIADO,
        fecha_creacion: subDays(hoy, 10),
      },
    ],
  });

  // Subactividad 1.2: EN_REVISION (Semáforo CRÍTICO: vencida hace 2 días)
  // Versión 1 fue devuelta y ya enviaron la Versión 2 con nuevas evidencias
  const sub1_2 = await prisma.subActividad.create({
    data: {
      actividad_id: act1Cucei.id,
      numero_orden: '1.2',
      indice_orden: calcularIndiceOrden('1.2'),
      descripcion_tarea: 'Validación fiscal SAT y normatividad de facturación del fondo',
      estado_operativo: EstadoSubActividad.EN_REVISION,
      tipo: TipoActividad.REVISION,
      fecha_inicio: subDays(hoy, 35),
      fecha_termino: subDays(hoy, 2), // CRÍTICO
      fecha_envio: subDays(hoy, 1), // Fecha de envío de la versión 2
      semanas_totales: diffWeeks(subDays(hoy, 35), subDays(hoy, 2)),
      banco_sub_actividad_id: catalogoBanco[3].sub_actividades_sugeridas[1].id,
    },
  });

  // V1 de Subactividad 1.2
  const entregaSub1_2_v1 = await prisma.entregaSubActividad.create({
    data: {
      sub_actividad_id: sub1_2.id,
      version: 1,
      estado_dictamen: EstadoDictamen.DEVUELTA_CON_OBSERVACIONES,
      comentarios_entrega: 'Primer informe de validación fiscal de comprobantes.',
      fecha_envio: subDays(hoy, 12),
      fecha_dictamen: subDays(hoy, 8),
    },
  });

  await prisma.observacion.createMany({
    data: [
      {
        entrega_id: entregaSub1_2_v1.id,
        numero_secuencia: 1,
        descripcion:
          'Existen 3 facturas con estatus de cancelación ante el portal del SAT.',
        estado_solvencia: EstadoSolvencia.SOLVENTADA,
      },
      {
        entrega_id: entregaSub1_2_v1.id,
        numero_secuencia: 2,
        descripcion:
          'Faltan las representaciones impresas con el sello digital legible.',
        estado_solvencia: EstadoSolvencia.SOLVENTADA,
      },
    ],
  });

  await prisma.evidencia.create({
    data: {
      sub_actividad_id: sub1_2.id,
      entrega_id: entregaSub1_2_v1.id,
      nombre_original: 'reporte_sat_preliminar_v1.pdf',
      s3_key: `cucei/2026/entregas/${randomUUID()}-sat_v1.pdf`,
      peso_bytes: 1823400,
      tipo_mime: 'application/pdf',
      estado: EstadoArchivoEvidencia.ENVIADO,
      fecha_creacion: subDays(hoy, 12),
    },
  });

  // V2 de Subactividad 1.2 (En revisión activa actualmente)
  const entregaSub1_2_v2 = await prisma.entregaSubActividad.create({
    data: {
      sub_actividad_id: sub1_2.id,
      version: 2,
      estado_dictamen: EstadoDictamen.EN_REVISION,
      comentarios_entrega:
        'Se solventan las 2 observaciones de la versión 1: se sustituyeron las facturas canceladas por comprobantes vigentes y se adjuntan acuses del SAT.',
      fecha_envio: subDays(hoy, 1),
      fecha_dictamen: null, // Aún sin dictaminar
    },
  });

  await prisma.evidencia.createMany({
    data: [
      {
        sub_actividad_id: sub1_2.id,
        entrega_id: entregaSub1_2_v2.id,
        nombre_original: 'acuses_sat_sustitucion_facturas_v2.pdf',
        s3_key: `cucei/2026/entregas/${randomUUID()}-acuses_sat_v2.pdf`,
        peso_bytes: 3120400,
        tipo_mime: 'application/pdf',
        estado: EstadoArchivoEvidencia.ENVIADO,
        fecha_creacion: subDays(hoy, 1),
      },
      {
        sub_actividad_id: sub1_2.id,
        entrega_id: entregaSub1_2_v2.id,
        nombre_original: 'cedula_fiscal_corregida.xlsx',
        s3_key: `cucei/2026/entregas/${randomUUID()}-cedula_fiscal_v2.xlsx`,
        peso_bytes: 1120000,
        tipo_mime:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        estado: EstadoArchivoEvidencia.ENVIADO,
        fecha_creacion: subDays(hoy, 1),
      },
    ],
  });

  // -------------------------------------------------------------------------
  // ACTIVIDAD 2: SEMÁFORO PRECAUCIÓN (< 5 días hábiles) - Obra Pública
  // -------------------------------------------------------------------------
  const act2Cucei = await prisma.actividad.create({
    data: {
      poa_id: poaCucei2026.id,
      folio: '002',
      titulo: 'Supervisión de Obra Pública: Remodelación de Laboratorios de Química',
      justificacion:
        'Verificar el avance físico y financiero del contrato de remodelación.',
      objetivo_general:
        'Comprobar la calidad de los materiales y el cumplimiento de los tiempos contratados.',
      objetivos_part:
        '- Inspección ocular en sitio.\n- Cotejo de números generadores.',
      meta_proyecto: 'Emisión del informe técnico de supervisión física.',
      indicadores: 'Porcentaje de estimaciones validadas.',
      fecha_inicio: subDays(hoy, 20),
      fecha_termino: addDays(hoy, 3), // PRECAUCIÓN: Menos de 5 días hábiles
      es_rezago: false,
      banco_actividad_id: catalogoBanco[0].id,
    },
  });
  await asignarAuditores(act2Cucei.id, [
    auditoresCucei[0],
    auditoresCucei[1],
  ]);

  // Subactividad 2.1: EN_PROGRESO (Semáforo PRECAUCIÓN: vence en 2 días)
  // Con archivos en borrador y pre-firma en S3 (sin entrega formal enviada aún)
  const sub2_1 = await prisma.subActividad.create({
    data: {
      actividad_id: act2Cucei.id,
      numero_orden: '2.1',
      indice_orden: calcularIndiceOrden('2.1'),
      descripcion_tarea: 'Inspección ocular y levantamiento fotográfico de avances de obra',
      estado_operativo: EstadoSubActividad.EN_PROGRESO,
      tipo: TipoActividad.AUDITORIA,
      fecha_inicio: subDays(hoy, 18),
      fecha_termino: addDays(hoy, 2), // PRECAUCIÓN
      fecha_envio: null,
      semanas_totales: diffWeeks(subDays(hoy, 18), addDays(hoy, 2)),
      banco_sub_actividad_id: catalogoBanco[0].sub_actividades_sugeridas[1].id,
    },
  });

  // Archivos en la bandeja del auditor antes del envío definitivo (S3 Draft y Pending)
  await prisma.evidencia.create({
    data: {
      sub_actividad_id: sub2_1.id,
      entrega_id: null, // En borrador local/S3, aún no empaquetado en entrega
      nombre_original: 'reporte_fotografico_preliminar.docx',
      s3_key: `cucei/2026/borradores/${randomUUID()}-reporte_fotos.docx`,
      peso_bytes: 4200150,
      tipo_mime:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      estado: EstadoArchivoEvidencia.BORRADOR,
      fecha_creacion: subDays(hoy, 2),
    },
  });

  await prisma.evidencia.create({
    data: {
      sub_actividad_id: sub2_1.id,
      entrega_id: null,
      nombre_original: 'planos_arquitectonicos_modificados.pdf',
      s3_key: `cucei/2026/pendientes/${randomUUID()}-planos_modificados.pdf`,
      peso_bytes: 8450100,
      tipo_mime: 'application/pdf',
      estado: EstadoArchivoEvidencia.PENDIENTE,
      fecha_creacion: subDays(hoy, 1),
    },
  });

  // Subactividad 2.2: SOLICITADO (Semáforo PRECAUCIÓN: vence en 4 días)
  await prisma.subActividad.create({
    data: {
      actividad_id: act2Cucei.id,
      numero_orden: '2.2',
      indice_orden: calcularIndiceOrden('2.2'),
      descripcion_tarea: 'Revisión y compulsa de números generadores y finiquito de obra',
      estado_operativo: EstadoSubActividad.SOLICITADO,
      tipo: TipoActividad.REVISION,
      fecha_inicio: subDays(hoy, 10),
      fecha_termino: addDays(hoy, 4), // PRECAUCIÓN
      fecha_envio: null,
      semanas_totales: diffWeeks(subDays(hoy, 10), addDays(hoy, 4)),
      banco_sub_actividad_id: catalogoBanco[0].sub_actividades_sugeridas[2].id,
    },
  });

  // -------------------------------------------------------------------------
  // ACTIVIDAD 3: SEMÁFORO A TIEMPO (> 15 días) - Activo Fijo
  // -------------------------------------------------------------------------
  const act3Cucei = await prisma.actividad.create({
    data: {
      poa_id: poaCucei2026.id,
      folio: '003',
      titulo: 'Censo e Inspección Física de Activo Fijo e Instrumental Científico',
      justificacion:
        'Comprobar la existencia física y vigencia de resguardos del equipo de cómputo y laboratorio.',
      objetivo_general:
        'Garantizar la veracidad del padrón de bienes patrimoniales.',
      objetivos_part:
        '- Cotejo con marbete QR.\n- Identificación de bienes en desuso.',
      meta_proyecto: 'Inspeccionar 500 bienes de alta especialidad.',
      indicadores: 'Porcentaje de bienes conciliados.',
      fecha_inicio: subDays(hoy, 15),
      fecha_termino: addDays(hoy, 35), // A TIEMPO (> 15 días)
      es_rezago: false,
      banco_actividad_id: catalogoBanco[1].id,
    },
  });
  await asignarAuditores(act3Cucei.id, [auditoresCucei[1]]);

  // Subactividad 3.1: CONCLUIDA (Semáforo A TIEMPO, entrega APROBADA)
  const sub3_1 = await prisma.subActividad.create({
    data: {
      actividad_id: act3Cucei.id,
      numero_orden: '3.1',
      indice_orden: calcularIndiceOrden('3.1'),
      descripcion_tarea: 'Cruce del padrón de activo fijo contra registros en pólizas contables',
      estado_operativo: EstadoSubActividad.CONCLUIDA,
      tipo: TipoActividad.REVISION,
      fecha_inicio: subDays(hoy, 25),
      fecha_termino: addDays(hoy, 25), // A TIEMPO
      fecha_envio: subDays(hoy, 7),
      semanas_totales: diffWeeks(subDays(hoy, 25), addDays(hoy, 25)),
      banco_sub_actividad_id: catalogoBanco[1].sub_actividades_sugeridas[0].id,
    },
  });

  const entregaSub3_1 = await prisma.entregaSubActividad.create({
    data: {
      sub_actividad_id: sub3_1.id,
      version: 1,
      estado_dictamen: EstadoDictamen.APROBADA,
      comentarios_entrega:
        'Entrega definitiva de la conciliación contable de bienes patrimoniales sin discrepancias detectadas.',
      fecha_envio: subDays(hoy, 7),
      fecha_dictamen: subDays(hoy, 4),
    },
  });

  await prisma.observacion.create({
    data: {
      entrega_id: entregaSub3_1.id,
      numero_secuencia: 1,
      descripcion:
        'Se verificó la total coincidencia entre la cuenta contable 1240 y el inventario del padrón institucional.',
      estado_solvencia: EstadoSolvencia.SOLVENTADA,
    },
  });

  await prisma.evidencia.createMany({
    data: [
      {
        sub_actividad_id: sub3_1.id,
        entrega_id: entregaSub3_1.id,
        nombre_original: 'dictamen_aprobacion_activo_fijo.pdf',
        s3_key: `cucei/2026/entregas/${randomUUID()}-dictamen_activo_fijo.pdf`,
        peso_bytes: 2890100,
        tipo_mime: 'application/pdf',
        estado: EstadoArchivoEvidencia.ENVIADO,
        fecha_creacion: subDays(hoy, 7),
      },
      {
        sub_actividad_id: sub3_1.id,
        entrega_id: entregaSub3_1.id,
        nombre_original: 'padron_conciliado_oficial.xlsx',
        s3_key: `cucei/2026/entregas/${randomUUID()}-padron_oficial.xlsx`,
        peso_bytes: 3510000,
        tipo_mime:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        estado: EstadoArchivoEvidencia.ENVIADO,
        fecha_creacion: subDays(hoy, 7),
      },
    ],
  });

  // Subactividad 3.2: EN_PROGRESO (Semáforo A TIEMPO: vence en 35 días)
  await prisma.subActividad.create({
    data: {
      actividad_id: act3Cucei.id,
      numero_orden: '3.2',
      indice_orden: calcularIndiceOrden('3.2'),
      descripcion_tarea: 'Verificación física aleatoria con marbete y código QR en departamentos',
      estado_operativo: EstadoSubActividad.EN_PROGRESO,
      tipo: TipoActividad.AUDITORIA,
      fecha_inicio: subDays(hoy, 5),
      fecha_termino: addDays(hoy, 35), // A TIEMPO
      fecha_envio: null,
      semanas_totales: diffWeeks(subDays(hoy, 5), addDays(hoy, 35)),
      banco_sub_actividad_id: catalogoBanco[1].sub_actividades_sugeridas[1].id,
    },
  });

  // Subactividad 3.3: SIN_EMPEZAR (Semáforo A TIEMPO: vence en 50 días)
  await prisma.subActividad.create({
    data: {
      actividad_id: act3Cucei.id,
      numero_orden: '3.3',
      indice_orden: calcularIndiceOrden('3.3'),
      descripcion_tarea: 'Elaboración de actas de baja para equipo obsoleto o inservible',
      estado_operativo: EstadoSubActividad.SIN_EMPEZAR,
      tipo: TipoActividad.REVISION,
      fecha_inicio: addDays(hoy, 10),
      fecha_termino: addDays(hoy, 50), // A TIEMPO
      fecha_envio: null,
      semanas_totales: diffWeeks(addDays(hoy, 10), addDays(hoy, 50)),
      banco_sub_actividad_id: null,
    },
  });

  // -------------------------------------------------------------------------
  // ACTIVIDAD 4: AUDITORÍA A NÓMINA DOCENTE (Variedad de Semáforos)
  // -------------------------------------------------------------------------
  const act4Cucei = await prisma.actividad.create({
    data: {
      poa_id: poaCucei2026.id,
      folio: '004',
      titulo: 'Auditoría a la Asistencia y Carga Horaria del Personal Académico de Ingenierías',
      justificacion:
        'Constatar que el personal docente cumpla con sus horas de clase y asesorías asignadas.',
      objetivo_general:
        'Validar la asistencia docente frente a grupo y checadores biométricos.',
      objetivos_part:
        '- Cruce con nómina institucional.\n- Inspección física en aulas de clase.',
      meta_proyecto: 'Revisión del 100% de la plantilla del Departamento de Computación.',
      indicadores: 'Índice de puntualidad y asistencia.',
      fecha_inicio: subDays(hoy, 30),
      fecha_termino: addDays(hoy, 20),
      es_rezago: false,
      banco_actividad_id: catalogoBanco[2].id,
    },
  });
  await asignarAuditores(act4Cucei.id, [auditoresCucei[0]]);

  // Subactividad 4.1: CONCLUIDA (A tiempo)
  const sub4_1 = await prisma.subActividad.create({
    data: {
      actividad_id: act4Cucei.id,
      numero_orden: '4.1',
      indice_orden: calcularIndiceOrden('4.1'),
      descripcion_tarea: 'Extracción de registros biométricos y conciliación de incidencias',
      estado_operativo: EstadoSubActividad.CONCLUIDA,
      tipo: TipoActividad.REVISION,
      fecha_inicio: subDays(hoy, 30),
      fecha_termino: subDays(hoy, 5),
      fecha_envio: subDays(hoy, 6),
      semanas_totales: diffWeeks(subDays(hoy, 30), subDays(hoy, 5)),
      banco_sub_actividad_id: catalogoBanco[2].sub_actividades_sugeridas[0].id,
    },
  });

  const entregaSub4_1 = await prisma.entregaSubActividad.create({
    data: {
      sub_actividad_id: sub4_1.id,
      version: 1,
      estado_dictamen: EstadoDictamen.APROBADA,
      comentarios_entrega: 'Informe de conciliación biométrica validado y aprobado.',
      fecha_envio: subDays(hoy, 6),
      fecha_dictamen: subDays(hoy, 3),
    },
  });

  await prisma.evidencia.create({
    data: {
      sub_actividad_id: sub4_1.id,
      entrega_id: entregaSub4_1.id,
      nombre_original: 'informe_conciliacion_biometrica.pdf',
      s3_key: `cucei/2026/entregas/${randomUUID()}-informe_biometrico.pdf`,
      peso_bytes: 1980300,
      tipo_mime: 'application/pdf',
      estado: EstadoArchivoEvidencia.ENVIADO,
      fecha_creacion: subDays(hoy, 6),
    },
  });

  // Subactividad 4.2: EN_REVISION (Semáforo PRECAUCIÓN: vence en 3 días)
  const sub4_2 = await prisma.subActividad.create({
    data: {
      actividad_id: act4Cucei.id,
      numero_orden: '4.2',
      indice_orden: calcularIndiceOrden('4.2'),
      descripcion_tarea: 'Supervisión presencial en aulas e integración de actas circunstanciadas',
      estado_operativo: EstadoSubActividad.EN_REVISION,
      tipo: TipoActividad.AUDITORIA,
      fecha_inicio: subDays(hoy, 12),
      fecha_termino: addDays(hoy, 3), // PRECAUCIÓN
      fecha_envio: subDays(hoy, 1),
      semanas_totales: diffWeeks(subDays(hoy, 12), addDays(hoy, 3)),
      banco_sub_actividad_id: catalogoBanco[2].sub_actividades_sugeridas[1].id,
    },
  });

  const entregaSub4_2 = await prisma.entregaSubActividad.create({
    data: {
      sub_actividad_id: sub4_2.id,
      version: 1,
      estado_dictamen: EstadoDictamen.EN_REVISION,
      comentarios_entrega:
        'Se presentan las actas circunstanciadas del recorrido de supervisión en aulas durante el turno matutino.',
      fecha_envio: subDays(hoy, 1),
      fecha_dictamen: null,
    },
  });

  await prisma.evidencia.create({
    data: {
      sub_actividad_id: sub4_2.id,
      entrega_id: entregaSub4_2.id,
      nombre_original: 'actas_recorrido_aulas_ingenieria.pdf',
      s3_key: `cucei/2026/entregas/${randomUUID()}-actas_recorrido.pdf`,
      peso_bytes: 3840100,
      tipo_mime: 'application/pdf',
      estado: EstadoArchivoEvidencia.ENVIADO,
      fecha_creacion: subDays(hoy, 1),
    },
  });

  // -------------------------------------------------------------------------
  // ACTIVIDADES 5 A 8: ACTIVIDADES ADICIONALES PARA LLENAR LOS DASHBOARDS
  // -------------------------------------------------------------------------
  interface ActividadAdicionalItem {
    folio: string;
    titulo: string;
    estadoSub1: EstadoSubActividad;
    estadoSub2: EstadoSubActividad;
    terminoDiasSub1: number;
    terminoDiasSub2: number;
  }

  const actividadesAdicionalesData: ActividadAdicionalItem[] = [
    {
      folio: '005',
      titulo: 'Fiscalización de Ingresos Autogenerados y Cuotas de Recuperación',
      estadoSub1: EstadoSubActividad.SOLICITADO,
      estadoSub2: EstadoSubActividad.SIN_EMPEZAR,
      terminoDiasSub1: 4, // PRECAUCIÓN
      terminoDiasSub2: 40, // A TIEMPO
    },
    {
      folio: '006',
      titulo: 'Auditoría a los Procesos de Licitación y Adjudicación de Servicios Generales',
      estadoSub1: EstadoSubActividad.EN_PROGRESO,
      estadoSub2: EstadoSubActividad.SIN_EMPEZAR,
      terminoDiasSub1: -3, // CRÍTICO
      terminoDiasSub2: 25, // A TIEMPO
    },
    {
      folio: '007',
      titulo: 'Revisión del Fondo de Apoyo a Proyectos de Investigación CONAHCYT',
      estadoSub1: EstadoSubActividad.CONCLUIDA,
      estadoSub2: EstadoSubActividad.CONCLUIDA,
      terminoDiasSub1: -10,
      terminoDiasSub2: -5,
    },
    {
      folio: '008',
      titulo: 'Seguimiento a Recomendaciones de la Auditoría Superior de la Federación (ASF)',
      estadoSub1: EstadoSubActividad.EN_REVISION,
      estadoSub2: EstadoSubActividad.DEVUELTA,
      terminoDiasSub1: 30, // A TIEMPO
      terminoDiasSub2: -4, // CRÍTICO
    },
  ];

  for (const item of actividadesAdicionalesData) {
    const act = await prisma.actividad.create({
      data: {
        poa_id: poaCucei2026.id,
        folio: item.folio,
        titulo: item.titulo,
        justificacion: `Verificación exhaustiva y cumplimiento del marco legal para ${item.titulo.toLowerCase()}.`,
        objetivo_general: `Asegurar la rendición de cuentas y la transparencia en la gestión correspondiente al folio ${item.folio}.`,
        objetivos_part:
          '- Muestreo selectivo de operaciones.\n- Compulsa de información y cierre de hallazgos.',
        meta_proyecto: 'Informe trimestral emitido y solventado al 100%.',
        indicadores: 'Porcentaje de observaciones solventadas en plazo.',
        fecha_inicio: subDays(hoy, 30),
        fecha_termino: addDays(hoy, 30),
        es_rezago: false,
      },
    });

    await asignarAuditores(act.id, [getRandomElement(auditoresCucei)]);

    // Subactividad 1
    const sub1 = await prisma.subActividad.create({
      data: {
        actividad_id: act.id,
        numero_orden: `${parseInt(item.folio, 10)}.1`,
        indice_orden: calcularIndiceOrden(`${parseInt(item.folio, 10)}.1`),
        descripcion_tarea: `Fase 1: Planeación y revisión preliminar de papeles de trabajo`,
        estado_operativo: item.estadoSub1,
        tipo: TipoActividad.REVISION,
        fecha_inicio: subDays(hoy, 25),
        fecha_termino: addDays(hoy, item.terminoDiasSub1),
        fecha_envio:
          item.estadoSub1 === EstadoSubActividad.EN_REVISION ||
          item.estadoSub1 === EstadoSubActividad.CONCLUIDA ||
          item.estadoSub1 === EstadoSubActividad.DEVUELTA
            ? subDays(hoy, 5)
            : null,
        semanas_totales: diffWeeks(
          subDays(hoy, 25),
          addDays(hoy, item.terminoDiasSub1),
        ),
      },
    });

    // Subactividad 2
    const sub2 = await prisma.subActividad.create({
      data: {
        actividad_id: act.id,
        numero_orden: `${parseInt(item.folio, 10)}.2`,
        indice_orden: calcularIndiceOrden(`${parseInt(item.folio, 10)}.2`),
        descripcion_tarea: `Fase 2: Dictamen técnico y elaboración de cédulas de observaciones`,
        estado_operativo: item.estadoSub2,
        tipo: TipoActividad.AUDITORIA,
        fecha_inicio: subDays(hoy, 15),
        fecha_termino: addDays(hoy, item.terminoDiasSub2),
        fecha_envio:
          item.estadoSub2 === EstadoSubActividad.EN_REVISION ||
          item.estadoSub2 === EstadoSubActividad.CONCLUIDA ||
          item.estadoSub2 === EstadoSubActividad.DEVUELTA
            ? subDays(hoy, 4)
            : null,
        semanas_totales: diffWeeks(
          subDays(hoy, 15),
          addDays(hoy, item.terminoDiasSub2),
        ),
      },
    });

    // Crear entregas para estados que lo requieran
    for (const sub of [sub1, sub2]) {
      if (sub.estado_operativo === EstadoSubActividad.DEVUELTA) {
        const entrega = await prisma.entregaSubActividad.create({
          data: {
            sub_actividad_id: sub.id,
            version: 1,
            estado_dictamen: EstadoDictamen.DEVUELTA_CON_OBSERVACIONES,
            comentarios_entrega: `Entrega de avance preliminar para ${sub.descripcion_tarea}.`,
            fecha_envio: subDays(hoy, 8),
            fecha_dictamen: subDays(hoy, 4),
          },
        });

        await prisma.observacion.create({
          data: {
            entrega_id: entrega.id,
            numero_secuencia: 1,
            descripcion:
              'Se detectaron inconsistencias entre los montos comprobados y los autorizados en el calendario.',
            estado_solvencia: EstadoSolvencia.PENDIENTE,
          },
        });

        await prisma.evidencia.create({
          data: {
            sub_actividad_id: sub.id,
            entrega_id: entrega.id,
            nombre_original: `evidencia_${sub.numero_orden.replace('.', '_')}.pdf`,
            s3_key: `cucei/2026/entregas/${randomUUID()}-evidencia.pdf`,
            peso_bytes: 1450200,
            tipo_mime: 'application/pdf',
            estado: EstadoArchivoEvidencia.ENVIADO,
            fecha_creacion: subDays(hoy, 8),
          },
        });
      } else if (sub.estado_operativo === EstadoSubActividad.EN_REVISION) {
        const entrega = await prisma.entregaSubActividad.create({
          data: {
            sub_actividad_id: sub.id,
            version: 1,
            estado_dictamen: EstadoDictamen.EN_REVISION,
            comentarios_entrega: `Se solicita validación formal para ${sub.descripcion_tarea}.`,
            fecha_envio: subDays(hoy, 2),
            fecha_dictamen: null,
          },
        });

        await prisma.evidencia.create({
          data: {
            sub_actividad_id: sub.id,
            entrega_id: entrega.id,
            nombre_original: `expediente_${sub.numero_orden.replace('.', '_')}.pdf`,
            s3_key: `cucei/2026/entregas/${randomUUID()}-expediente.pdf`,
            peso_bytes: 2560300,
            tipo_mime: 'application/pdf',
            estado: EstadoArchivoEvidencia.ENVIADO,
            fecha_creacion: subDays(hoy, 2),
          },
        });
      } else if (sub.estado_operativo === EstadoSubActividad.CONCLUIDA) {
        const entrega = await prisma.entregaSubActividad.create({
          data: {
            sub_actividad_id: sub.id,
            version: 1,
            estado_dictamen: EstadoDictamen.APROBADA,
            comentarios_entrega: `Dictamen de conclusión satisfactoria para ${sub.descripcion_tarea}.`,
            fecha_envio: subDays(hoy, 10),
            fecha_dictamen: subDays(hoy, 5),
          },
        });

        await prisma.evidencia.create({
          data: {
            sub_actividad_id: sub.id,
            entrega_id: entrega.id,
            nombre_original: `cierre_${sub.numero_orden.replace('.', '_')}.pdf`,
            s3_key: `cucei/2026/entregas/${randomUUID()}-cierre.pdf`,
            peso_bytes: 1980000,
            tipo_mime: 'application/pdf',
            estado: EstadoArchivoEvidencia.ENVIADO,
            fecha_creacion: subDays(hoy, 10),
          },
        });
      }
    }
  }

  // =========================================================================
  // PASO 8: POAS NO AUTORIZADOS (REGLA ESTRICTA DE NEGOCIO: SÓLO 'SIN_EMPEZAR')
  // =========================================================================
  console.log('🔒 Creando subactividades para POAs NO autorizados (CUVALLES y CUCS)...');

  // CUVALLES 2026 (EN_REVISION)
  const act1Cuvalles = await prisma.actividad.create({
    data: {
      poa_id: poaCuvalles2026.id,
      folio: '001',
      titulo: 'Auditoría a los Procesos de Titulación y Aranceles en CUVALLES',
      justificacion:
        'Verificar el ingreso transparente de pagos por concepto de trámites escolares.',
      objetivo_general:
        'Asegurar el control interno sobre los aranceles recaudados.',
      objetivos_part:
        '- Revisión de fichas de depósito.\n- Conciliación con el sistema escolar.',
      meta_proyecto: 'Revisión del ejercicio anual.',
      indicadores: 'Porcentaje de expedientes de titulación auditados.',
      fecha_inicio: addDays(hoy, 15),
      fecha_termino: addDays(hoy, 90),
      porcentaje_global: 0.0, // Regla de negocio: Sin progreso porque el POA no es Ley Operativa
      es_rezago: false,
    },
  });
  await asignarAuditores(act1Cuvalles.id, [usuarioAuditorCuvalles.auditor!.id]);

  await prisma.subActividad.createMany({
    data: [
      {
        actividad_id: act1Cuvalles.id,
        numero_orden: '1.1',
        indice_orden: calcularIndiceOrden('1.1'),
        descripcion_tarea: 'Recolección y foliación de recibos de pago de aranceles',
        estado_operativo: EstadoSubActividad.SIN_EMPEZAR, // Regla estricta: SIN_EMPEZAR
        tipo: TipoActividad.REVISION,
        fecha_inicio: addDays(hoy, 15),
        fecha_termino: addDays(hoy, 45),
        fecha_envio: null, // Sin entregas
        semanas_totales: diffWeeks(addDays(hoy, 15), addDays(hoy, 45)),
      },
      {
        actividad_id: act1Cuvalles.id,
        numero_orden: '1.2',
        indice_orden: calcularIndiceOrden('1.2'),
        descripcion_tarea: 'Cruce del padrón de titulados contra depósitos en cuenta bancaria',
        estado_operativo: EstadoSubActividad.SIN_EMPEZAR, // Regla estricta: SIN_EMPEZAR
        tipo: TipoActividad.AUDITORIA,
        fecha_inicio: addDays(hoy, 46),
        fecha_termino: addDays(hoy, 90),
        fecha_envio: null,
        semanas_totales: diffWeeks(addDays(hoy, 46), addDays(hoy, 90)),
      },
    ],
  });

  const act2Cuvalles = await prisma.actividad.create({
    data: {
      poa_id: poaCuvalles2026.id,
      folio: '002',
      titulo: 'Supervisión del Equipamiento de Aulas Híbridas y Redes',
      justificacion:
        'Constatar la instalación de tecnología para clases híbridas.',
      objetivo_general:
        'Verificar el inventario y conectividad en campus tecnológico.',
      meta_proyecto: 'Cobertura del 100% de aulas proyectadas.',
      indicadores: 'Porcentaje de aulas equipadas conforme a contrato.',
      fecha_inicio: addDays(hoy, 30),
      fecha_termino: addDays(hoy, 120),
      porcentaje_global: 0.0,
      es_rezago: false,
    },
  });
  await asignarAuditores(act2Cuvalles.id, [usuarioAuditorCuvalles.auditor!.id]);

  await prisma.subActividad.create({
    data: {
      actividad_id: act2Cuvalles.id,
      numero_orden: '2.1',
      indice_orden: calcularIndiceOrden('2.1'),
      descripcion_tarea: 'Inspección física y pruebas de conexión de conmutadores y switches',
      estado_operativo: EstadoSubActividad.SIN_EMPEZAR,
      tipo: TipoActividad.AUDITORIA,
      fecha_inicio: addDays(hoy, 30),
      fecha_termino: addDays(hoy, 120),
      fecha_envio: null,
      semanas_totales: diffWeeks(addDays(hoy, 30), addDays(hoy, 120)),
    },
  });

  // CUCS 2026 (DEVUELTA)
  const act1Cucs = await prisma.actividad.create({
    data: {
      poa_id: poaCucs2026.id,
      folio: '001',
      titulo: 'Auditoría al Control de Insumos y Medicamentos en Laboratorios de Odontología y Medicina',
      justificacion:
        'Evitar caducidad de biológicos y vigilar la custodia de material de curación.',
      objetivo_general:
        'Implementar controles de PEPS (Primeras Entradas, Primeras Salidas).',
      meta_proyecto: 'Auditar 4 almacenes clínicos del campus.',
      indicadores: 'Merma reportada vs inventario inicial.',
      fecha_inicio: addDays(hoy, 20),
      fecha_termino: addDays(hoy, 100),
      porcentaje_global: 0.0,
      es_rezago: false,
    },
  });
  await asignarAuditores(act1Cucs.id, [usuarioAuditorCucs.auditor!.id]);

  await prisma.subActividad.createMany({
    data: [
      {
        actividad_id: act1Cucs.id,
        numero_orden: '1.1',
        indice_orden: calcularIndiceOrden('1.1'),
        descripcion_tarea: 'Toma de inventario físico en el almacén de reactivos y medicamentos',
        estado_operativo: EstadoSubActividad.SIN_EMPEZAR,
        tipo: TipoActividad.AUDITORIA,
        fecha_inicio: addDays(hoy, 20),
        fecha_termino: addDays(hoy, 60),
        fecha_envio: null,
        semanas_totales: diffWeeks(addDays(hoy, 20), addDays(hoy, 60)),
      },
      {
        actividad_id: act1Cucs.id,
        numero_orden: '1.2',
        indice_orden: calcularIndiceOrden('1.2'),
        descripcion_tarea: 'Revisión de bitácoras de temperatura y fechas de caducidad',
        estado_operativo: EstadoSubActividad.SIN_EMPEZAR,
        tipo: TipoActividad.REVISION,
        fecha_inicio: addDays(hoy, 61),
        fecha_termino: addDays(hoy, 100),
        fecha_envio: null,
        semanas_totales: diffWeeks(addDays(hoy, 61), addDays(hoy, 100)),
      },
    ],
  });

  // =========================================================================
  // PASO 9: POA HISTÓRICO 2025 (SIMULACIÓN DE REZAGO INSTITUCIONAL)
  // =========================================================================
  console.log('⏳ Sembrando POA histórico 2025 para activar KPIs de Rezago...');

  // Actividad con rezago (año anterior, POA autorizado, con subactividad pendiente)
  const actRezagoCucei = await prisma.actividad.create({
    data: {
      poa_id: poaCucei2025.id,
      folio: '001',
      titulo: 'Abatir el Rezago en Solventación de Observaciones de Adquisiciones 2025',
      justificacion:
        'Atender las observaciones derivadas de la cuenta pública del ejercicio 2025 que quedaron pendientes.',
      objetivo_general:
        'Cerrar el pliego de observaciones de adquisiciones y compras menores.',
      meta_proyecto: 'Solventación total de 12 observaciones históricas.',
      indicadores: 'Porcentaje de solventación de rezago.',
      fecha_inicio: subDays(hoy, 380),
      fecha_termino: subDays(hoy, 90),
      es_rezago: true, // Marcada explícitamente como actividad de rezago
    },
  });
  await asignarAuditores(actRezagoCucei.id, [auditoresCucei[0]]);

  // Subactividad concluida de 2025
  await prisma.subActividad.create({
    data: {
      actividad_id: actRezagoCucei.id,
      numero_orden: '1.1',
      indice_orden: calcularIndiceOrden('1.1'),
      descripcion_tarea: 'Integración del expediente de compra consolidada de papelería',
      estado_operativo: EstadoSubActividad.CONCLUIDA,
      tipo: TipoActividad.REVISION,
      fecha_inicio: subDays(hoy, 380),
      fecha_termino: subDays(hoy, 200),
      fecha_envio: subDays(hoy, 205),
      semanas_totales: diffWeeks(subDays(hoy, 380), subDays(hoy, 200)),
    },
  });

  // Subactividad NO CONCLUIDA de 2025 (Activa el conteo de contarRezagosHistoricos)
  const subRezagoPendiente = await prisma.subActividad.create({
    data: {
      actividad_id: actRezagoCucei.id,
      numero_orden: '1.2',
      indice_orden: calcularIndiceOrden('1.2'),
      descripcion_tarea: 'Solventación de observaciones sobre pólizas de garantías de proveedores',
      estado_operativo: EstadoSubActividad.DEVUELTA, // Permanece en rezago
      tipo: TipoActividad.AUDITORIA,
      fecha_inicio: subDays(hoy, 200),
      fecha_termino: subDays(hoy, 90), // Vencida en el pasado
      fecha_envio: subDays(hoy, 110),
      semanas_totales: diffWeeks(subDays(hoy, 200), subDays(hoy, 90)),
    },
  });

  const entregaRezago = await prisma.entregaSubActividad.create({
    data: {
      sub_actividad_id: subRezagoPendiente.id,
      version: 1,
      estado_dictamen: EstadoDictamen.DEVUELTA_CON_OBSERVACIONES,
      comentarios_entrega:
        'Entrega de expedientes de fianza de cumplimiento ejercicio 2025.',
      fecha_envio: subDays(hoy, 110),
      fecha_dictamen: subDays(hoy, 95),
    },
  });

  await prisma.observacion.create({
    data: {
      entrega_id: entregaRezago.id,
      numero_secuencia: 1,
      descripcion:
        'La póliza de fianza del proveedor de cómputo venció antes de la entrega formal de los bienes.',
      estado_solvencia: EstadoSolvencia.NO_SOLVENTADA,
    },
  });

  // =========================================================================
  // PASO 10: RECÁLCULO DDD DEL PORCENTAJE GLOBAL DE TODAS LAS ACTIVIDADES
  // =========================================================================
  console.log('📐 Recalculando porcentaje global de avance según Domain-Driven Design...');
  const todasLasActividades = await prisma.actividad.findMany({
    include: {
      sub_actividades: true,
      poa: true,
    },
  });

  for (const act of todasLasActividades) {
    let porcentaje = 0.0;

    // Regla de Negocio: POAs NO autorizados mantienen 0% de avance
    if (act.poa.estado === EstadoPoa.AUTORIZADO) {
      const total = act.sub_actividades.length;
      if (total > 0) {
        const concluidas = act.sub_actividades.filter(
          (sub) => sub.estado_operativo === EstadoSubActividad.CONCLUIDA,
        ).length;
        porcentaje = Math.round((concluidas / total) * 10000) / 100;
      }
    }

    await prisma.actividad.update({
      where: { id: act.id },
      data: { porcentaje_global: porcentaje },
    });
  }

  // =========================================================================
  // RESUMEN FINAL DE SIEMBRA
  // =========================================================================
  console.log('\n======================================================');
  console.log('🎉 ¡SIEMBRA DE DATOS COMPLETADA CON ÉXITO ABSOLUTO!');
  console.log('======================================================');
  console.log('📊 Resumen de infraestructura inyectada:');
  console.log('  - Centros Universitarios: CUCEI, CUVALLES, CUCS, CUCEA');
  console.log('  - Personal:');
  console.log('      * Jefa: Dra. Carmen Patricia Rosas (jefa@contraloria.udg.mx)');
  console.log('      * Contralor CUCEI: Mtro. Héctor Navarro (contralor.cucei@udg.mx)');
  console.log('      * Contralor CUVALLES: Mtra. Sofía Morales (contralor.cuvalles@udg.mx)');
  console.log('      * Contralor CUCS: Dr. Roberto Mendoza (contralor.cucs@udg.mx)');
  console.log('      * Auditores: 4 auditores con cuentas individuales');
  console.log('      * Contraseña universal: Admin123!');
  console.log('  - POAs creados:');
  console.log(`      * CUCEI ${anioActual}: AUTORIZADO (Operativo con semáforos)`);
  console.log(`      * CUVALLES ${anioActual}: EN_REVISION (Subactividades en SIN_EMPEZAR)`);
  console.log(`      * CUCS ${anioActual}: DEVUELTA (Subactividades en SIN_EMPEZAR)`);
  console.log(`      * CUCEI ${anioAnterior}: AUTORIZADO (Histórico con rezago activo)`);
  console.log('  - Semáforos relativos a la fecha de ejecución:');
  console.log('      * Semáforo Crítico: Vencidas en el pasado (hoy > termino)');
  console.log('      * Semáforo Precaución: Vencimiento a < 5 días hábiles');
  console.log('      * Semáforo A Tiempo: Vencimiento a > 15 días');
  console.log('  - Versionado S3 y Observaciones Granulares:');
  console.log('      * Entregas inmutables v1 y v2');
  console.log('      * Observaciones asociadas a entregas (PENDIENTE, SOLVENTADA, etc.)');
  console.log('      * Evidencias con mime-types reales y estados PENDIENTE, BORRADOR y ENVIADO');
  console.log('======================================================\n');
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
