import { ApiProperty } from "@nestjs/swagger";
import { PendientesDto } from "./dashboard-jefa-pendientes.dto";
import { RiesgoCriticoDto } from "./dashboard-jefa-riesgo-critico.dto";
import { PrecaucionDto } from "./dashboard-jefa-precaucion.dto";
import { TasaSolventacionDto } from "./dashboard-jefa-tasa-solventacion.dto";

export class TarjetasSuperioresDto{
    @ApiProperty({
        description: 'Tarjeta de las tareas pendientes',
        type: () => PendientesDto,
    })
    pendientes: PendientesDto;

    @ApiProperty({
        description: 'Tarjeta de las tareas con riesgo critico',
        type: () => RiesgoCriticoDto,
    })
    riesgo_critico: RiesgoCriticoDto;

    @ApiProperty({
        description: 'Tarjeta de las tareas en estado de precaucion',
        type: () => PrecaucionDto,
    })
    precaucion: PrecaucionDto;

    @ApiProperty({
        description: 'Tarjeta de la tasa de solventacion',
        type: () => TasaSolventacionDto,
    })
    tasa_solventacion: TasaSolventacionDto;

}