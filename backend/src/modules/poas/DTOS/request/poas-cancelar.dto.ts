import { ApiProperty } from "@nestjs/swagger";
import { Estado } from "../response/poa-actual.dto";

class CancelarPoaDto{
    @ApiProperty({
        description: 'ID de la POA a cancelar',
        type: String,
        example: "uuid-poa-1234"
    })
    poa_id: string;

    @ApiProperty({
        description: 'Estado anterior de la POA',
        example: "EN_REVISION"
    })
    estado_anterior: Estado;

    @ApiProperty({
        description: 'Estado nuevo de la POA',
        example: "BORRADOR"
    })
    estado_nuevo: Estado;

    @ApiProperty({
        description: 'Fecha de cancelación de la POA',
        type: String,
        example: "2026-06-28T19:45:00Z"
    })
    fecha_cancelacion: string;

    @ApiProperty({
        description: 'Mensaje de cancelación de la POA',
        type: String,
        example: "El envío ha sido cancelado. El POA vuelve a estar disponible para su edición."
    })
    mensaje: string;
}

export class CancelarPoaDataDto{
    @ApiProperty({
        type: CancelarPoaDto
    })
    data: CancelarPoaDto;
}