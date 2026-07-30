/**
 * Tipo de dato que va a ser usado en las entidades que se beneficien de una transacción a la base de datos
 * Donde dos o más entidades (a priori no acopladas) puedan hacer la query en simultaneo.
 *
 * El tipo es unknown para dejar al domain agnóstico a infraestructura
 * Se usará en la Unidad de Trabajo y su im0plementación acoplada al tipo de base de datos y tecnología que se utilice
 */
export type TransactionHandle = unknown;
