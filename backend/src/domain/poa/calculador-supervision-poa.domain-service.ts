import { calcularAvanceGlobal } from './avance-poa';
import { EstadosPoa } from './estados-poa.enum';

export interface KpisSupervisionPoa {
  totalCentros: number;
  porAutorizar: number;
  devueltas: number;
  autorizadas: number;
}

export class CalculadorSupervisionPoa {
  /**
   * Cuenta los centros según el estado de su POA del año vigente.
   * `null` = el centro no tiene POA ese año; cuenta en el total pero en ningún estado.
   */
  static calcularKpisGlobales(
    estadosPoaAnioActual: Array<EstadosPoa | null>,
  ): KpisSupervisionPoa {
    const contar = (estado: EstadosPoa): number =>
      estadosPoaAnioActual.filter((e) => e === estado).length;

    return {
      totalCentros: estadosPoaAnioActual.length,
      porAutorizar: contar(EstadosPoa.EN_REVISION),
      devueltas: contar(EstadosPoa.DEVUELTA),
      autorizadas: contar(EstadosPoa.AUTORIZADA),
    };
  }

  /**
   * El avance global solo se reporta para POAs AUTORIZADAS.
   * Para el resto es null.
   */
  static calcularAvance(
    estado: EstadosPoa,
    porcentajesActividades: number[],
  ): number | null {
    return estado === EstadosPoa.AUTORIZADA
      ? calcularAvanceGlobal(porcentajesActividades)
      : null;
  }
}