import { ApiProperty } from "@nestjs/swagger";
import { BandejaEntradaDto } from "./dashboard-bandeja.dto";

export class TarjetasDto{
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