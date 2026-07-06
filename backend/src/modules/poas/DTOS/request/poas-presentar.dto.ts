import { ApiProperty } from "@nestjs/swagger";
import { Estado } from "../response/poa-actual.dto";

class PresentarPoasDataDto {
    @ApiProperty({
        description: 'ID de la POA a presentar',
        type: String,
        example: "uuid-poa-1234"
    })
    poa_id: string;

    @ApiProperty({
        description: 'Estado anterior de la POA',
        example: "BORRADOR",
    })
    estado_anterior: Estado;

    @ApiProperty({
        description: 'Estado nuevo de la POA',
        example: "EN_REVISION"
    })
    estado_nuevo: Estado;

    @ApiProperty({
        description: 'Fecha y hora en la que se envio la POA',
        type: String,
        example: "2026-06-28T19:30:00Z"
    })
    fecha_envio: string;

    @ApiProperty({
        description: 'ID de la POA a presentar',
        type: String,
        example: "uuid-poa-1234"
    })
    mensaje: string;
    }
    
export class PresentarPoasDto{
    @ApiProperty({ 
        type: PresentarPoasDataDto 
    })
    data: PresentarPoasDataDto;
}
    