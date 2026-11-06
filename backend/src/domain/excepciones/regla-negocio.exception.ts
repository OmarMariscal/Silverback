import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';

export class ReglaNegocioException extends Error {
  private codigoViolacion: CodigoDeViolacion;

  constructor(message: string, codigoViolacion: CodigoDeViolacion) {
    super(message);
    this.name = 'ReglaNegocioException';
    this.codigoViolacion = codigoViolacion;

    Object.setPrototypeOf(this, ReglaNegocioException.prototype);
  }

  get codigoViolado() {
    return this.codigoViolacion;
  }
}
