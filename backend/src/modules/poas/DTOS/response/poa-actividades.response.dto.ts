import { ApiProperty } from "@nestjs/swagger";

export class CrearActividadesResponseDto{
    @ApiProperty({
        description: 'ID de la nueva actividad agregada',
        type: String,
        example: "act-nueva-uuid-999"
    })
    id: string;

    @ApiProperty({
        description: 'Folio de la nueva actividad agregada',
        type: String,
        example: "03"
    })
    folio: string;

    @ApiProperty({
        description: 'Mensaje API de que la accion fue completada con exito',
        type: String,
        example: "Actividad guardada exitosamente."
    })
    mensaje: string;

    constructor(partial: Partial<CrearActividadesResponseDto>){
        Object.assign(this, partial);
    }
}