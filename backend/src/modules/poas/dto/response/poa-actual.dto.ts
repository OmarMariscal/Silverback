import { ApiProperty } from "@nestjs/swagger";
import { ActividadesResumenDto } from "./poa-actual-actividades.dto";
import { EstadosPoa } from "@domain/poa/estados-poa.enum";

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
        example:    EstadosPoa.BORRADOR
    })
    estado: EstadosPoa;

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
        description: "Lista de actividades de manera resumida",
        type: [ActividadesResumenDto],
    })
    actividades_resumen: ActividadesResumenDto[]; 
}