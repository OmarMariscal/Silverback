import { ApiProperty } from "@nestjs/swagger";
import { ActividadesResumenDto } from "./poa-actual-actividades.dto";
import { EstadosActividades } from "@domain/actividad/estados-actividades.enum";

export class PoaActualDto{

    @ApiProperty({
        description: "ID unico de la POA actual",
        type: String,
        example: "poa-2026-uuid"
    })
    id: string;

    @ApiProperty({
        description: "Anio fiscal en la que se encuentra la POA",
        type: Number,
        example: 2026
    })
    anio_fiscal: number;

    @ApiProperty({
        description: "Estado de la actividad(enum)",
        example:    EstadosActividades.EN_PROGRESO
    })
    estado: EstadosActividades;

    @ApiProperty({
        description: "Fecha de inicio de la POA",
        type: String,
        example: "Ene 2026"
    })
    fecha_inicio: string;

    @ApiProperty({
        description: "Fecha de termino de la POA",
        type: String,
        example: "Dic 2026"
    })
    fecha_termino: string;

    @ApiProperty({
        description: "Le indica al sistema si la POA tiene actividades rezagadas.",
        type: Boolean,
        example: false
    })
    es_rezagado: boolean;
    
    @ApiProperty({
        description: "Lista de actividades de manera resumida",
        type: [ActividadesResumenDto],
    })
    actividades_resumen: ActividadesResumenDto[]; 
}