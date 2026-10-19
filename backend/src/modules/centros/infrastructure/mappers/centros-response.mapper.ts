import { DateFormatterUtil } from '@core/utils/date-formater.utils';
import { PoaDeCentroResult } from '@modules/centros/application/ports/results/poa-de-centro.result';
import { PoaDeCentroResponseDto } from '@modules/centros/dto/response/poa-de-centro.response.dto';

export class CentrosResponseMapper {
    static toPoaDeCentroDto(result: PoaDeCentroResult): PoaDeCentroResponseDto {
      const fecha = (valor: Date | null): string | null =>
        valor ? DateFormatterUtil.toAnioMesDia(valor) : null;
  
      return {
        poa: {
          id: result.id,
          anio_fiscal: result.anioFiscal,
          estado: result.estado,
          mensaje_resolucion: result.mensajeResolucion,
          // TODO(equipo): null hasta decidir si se agrega Poa.fecha_envio en BD
          fecha_envio: null,
          centro: {
            clave: result.centro.clave,
            nombre: result.centro.nombre,
          },
          contralor: { nombre_completo: result.contralor.nombreCompleto },
        },
        actividades: result.actividades.map((act) => ({
          id: act.id,
          folio: act.folio,
          titulo: act.titulo,
          fecha_inicio: fecha(act.fechaInicio),
          fecha_termino: fecha(act.fechaTermino),
          porcentaje_global: act.porcentajeGlobal,
          auditores: act.auditoresNombres,
        })),
      };
    }
}