import { EstadoPoa } from '@prisma/client';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';

export const MAPA_ESTADOS_POA_A_DOMINIO: Record<EstadoPoa, EstadosPoa> = {
  [EstadoPoa.BORRADOR]: EstadosPoa.BORRADOR,
  [EstadoPoa.EN_REVISION]: EstadosPoa.EN_REVISION,
  [EstadoPoa.DEVUELTA]: EstadosPoa.DEVUELTA,
  [EstadoPoa.AUTORIZADO]: EstadosPoa.AUTORIZADA,
};

export const MAPA_ESTADOS_POA_A_PRISMA: Record<EstadosPoa, EstadoPoa> = {
  [EstadosPoa.BORRADOR]: EstadoPoa.BORRADOR,
  [EstadosPoa.EN_REVISION]: EstadoPoa.EN_REVISION,
  [EstadosPoa.DEVUELTA]: EstadoPoa.DEVUELTA,
  [EstadosPoa.AUTORIZADA]: EstadoPoa.AUTORIZADO,
};

export const traducirEstadoPoaADominio = (estadoPrisma: EstadoPoa) => {
  return MAPA_ESTADOS_POA_A_DOMINIO[estadoPrisma];
};

export const traducirEstadoPoaAPrisma = (estadoDominio: EstadosPoa) => {
  return MAPA_ESTADOS_POA_A_PRISMA[estadoDominio];
};
