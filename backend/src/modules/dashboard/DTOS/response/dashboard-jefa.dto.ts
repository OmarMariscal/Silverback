import { ApiProperty } from "@nestjs/swagger";

class PendientesDto{
    @ApiProperty({
        description: 'Numero de actividades por revisar',
        type: Number,
        example: 14
    })
    actividades_por_revisar: number;

    @ApiProperty({
        description: 'Numero de actividades solicitadas',
        type: Number,
        example: 5
    })
    actividades_solicitades: number;
}

class RiesgoCriticoDto{
    @ApiProperty({
        description: 'Numero de actividades en riesgo critico',
        type: Number,
        example: 8
    })
    total: number;

    @ApiProperty({
        description: 'Descripcion del estado de las actividades que caen en esta categoria',
        type: String,
        example: "Vencidas o por vencer"
    })
    descripcion: string;
}

class PrecaucionDto{
    @ApiProperty({
        description: 'Numero de actividades en precaucion',
        type: Number,
        example: 23
    })
    total: number;

    @ApiProperty({
        description: 'Descripcion del estado de las actividades que caen en esta categoria',
        type: String,
        example: "A menos de 15 días"
    })
    descripcion: string;
}

class TasaSolventacionDto{
    @ApiProperty({
        description: 'Porcentaje de actividades solventadas',
        type: Number,
        example: 68
    })
    porentaje: number;

    @ApiProperty({
        description: 'Tendencia mensual de solventacion',
        type: String,
        example: "+5%"
    })
    tendencia_mes: string;
}

class TarjetasSuperioresDto{
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

class GraficaSemaforoDto{
    @ApiProperty({
        description: 'Cantidad de tareas en estado de "a tiempo"',
        type: Number,
        example: 85
    })
    a_tiempo: number;

    @ApiProperty({
        description: 'Cantidad de tareas en estado de "alerta"',
        type: Number,
        example: 35
    })
    alerta: number;

    @ApiProperty({
        description: 'Cantidad de tareas en estado de "critico"',
        type: Number,
        example: 22
    })
    critico: number;

    @ApiProperty({
        description: 'Total de tareas',
        type: Number,
        example: 142
    })
    total_actividades_red: number;
}

class GraficaDistribucionDto{
    @ApiProperty({
        description: 'Numero de actividades sin empezar',
        type: Number,
        example: 28
    })
    sin_empezar: number;

    @ApiProperty({
        description: 'Numero de actividades en proceso',
        type: Number,
        example: 64
    })
    en_proceso: number;

    @ApiProperty({
        description: 'Numero de actividades por revisar',
        type: Number,
        example: 14
    })
    por_revisar: number;

    @ApiProperty({
        description: 'Numero de actividades concluidas',
        type: Number,
        example: 36
    })
    concluidas: number;

    @ApiProperty({
        description: 'Total de actividades',
        type: Number,
        example: 142
    })
    total_actividades_red: number;
}

export class DashboardJefaDto {
    @ApiProperty({
        description: 'Apartado de tarjetas en el dashboard',
        type: () => TarjetasSuperioresDto,
    })
    tarjetas_superiores: TarjetasSuperioresDto;

    @ApiProperty({
        description: 'Grafica de semaforo',
        type: GraficaSemaforoDto,
    })
    grafica_semaforos: GraficaSemaforoDto;

    @ApiProperty({
        description: 'Grafica de estados',
        type: GraficaDistribucionDto,
    })
    grafica_distribucion_estado: GraficaDistribucionDto;
}
