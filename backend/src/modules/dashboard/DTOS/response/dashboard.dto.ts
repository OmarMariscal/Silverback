import { ApiProperty } from "@nestjs/swagger";

class CentroUniversitarioDto{
    @ApiProperty({
        description: "Clave del centro universitario",
        type: String,
        example: "CU VALLES"
    })
    clave: string;

    @ApiProperty({
        description: "Nombre del centro universitario",
        type: String,
        example: "Centro Universitario de los Valles"
    })
    nombre: string;
}

class BandejaEntradaDto{
    @ApiProperty({
        description: "Número de actividades devueltas para corrección",
        type: Number,
        example: 3
    })
    devueltas: number;

    @ApiProperty({
        description: "Número de actividades listas para empezar",
        type: Number,
        example: 4
    })
    listas_empezar: number;
}

class TarjetasDto{
    @ApiProperty({
        description: "Información de la bandeja de entrada",
        type: () => BandejaEntradaDto
    })
    bandeja_entrada: BandejaEntradaDto;

    @ApiProperty({
        description: "Número de actividades con riesgo crítico",
        type: Number,
        example: 2
    })
    riesgo_critico: number;

    @ApiProperty({
        description: "Número de actividades con precaución",
        type: Number,
        example: 5
    })
    precaucion: number;
    
    @ApiProperty({
        description: "Tasa de solventación de actividades",
        type: Number,
        example: 82
    })
    tasa_solventacion: number;
}


class SemaforosDto{
    @ApiProperty({
        description: "Numero de actividades en verde",
        type: Number,
        example: 17
    })
    a_tiempo: number;

    @ApiProperty({
        description: "Número de actividades en amarillo",
        type: Number,
        example: 5
    })
    alerta: number;

    @ApiProperty({
        description: "Número de actividades en rojo",
        type: Number,
        example: 2
    })
    critico: number;

    @ApiProperty({
        description: "Número de actividades totales",
        type: Number,
        example: 14
    })
    total: number;
}

class FlujoDto{
    @ApiProperty({
        description: "Número de actividades sin empezar",
        type: Number,
        example: 4
    })
    sin_empezar: number;

    @ApiProperty({
        description: "Número de actividades en proceso",
        type: Number,
        example: 12
    })
    en_proceso: number;

    @ApiProperty({
        description: "Número de actividades por revisar",
        type: Number,
        example: 2
    })
    por_revisar: number;

    @ApiProperty({
        description: "Número de actividades concluidas",
        type: Number,
        example: 6
    })
    concluidas: number;

    @ApiProperty({
        description: "Número de actividades totales",
        type: Number,
        example: 24
    })
    total: number;
}

class GraficasDto{
    @ApiProperty({
        description: "Distribucion general del semaforo del contralor",
        type: () => SemaforosDto
    })
    semaforos: SemaforosDto;

    @ApiProperty({
        description: "Flujo de trabajo del contralor",
        type: () => FlujoDto
    })
    flujo: FlujoDto;
}

export class DashboardDto {
    @ApiProperty({
        description: "Apartado de centros universitarios",
        type: () => CentroUniversitarioDto,
    })
    centro_universitario: CentroUniversitarioDto;

    @ApiProperty({
        description: "Apartado de tarjetas de información",
        type: () => TarjetasDto
    })
    tarjetas: TarjetasDto;

    @ApiProperty({
        description: "Apartado de gráficas",
        type: () => GraficasDto
    })
    graficas: GraficasDto;
}