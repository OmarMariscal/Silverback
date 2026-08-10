export class RecursoNoEncontradoException extends Error {
  constructor(recurso: string, identificador: string, userId: string) {
    super(
      `El recurso '${recurso}' con identificador '${identificador}' no fue encontrado para el usuario ${userId}.`,
    );
    this.name = 'RecursoNoEncontradoException';

    Object.setPrototypeOf(this, RecursoNoEncontradoException.prototype);
  }
}
