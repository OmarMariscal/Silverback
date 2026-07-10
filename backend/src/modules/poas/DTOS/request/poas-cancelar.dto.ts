import { ApiProperty } from "@nestjs/swagger";
import { EstadosActividades } from "@domain/actividad/estados-actividades.enum";
import { IsDate, IsDateString, IsEnum, IsString } from "class-validator";

export class CancelarPoaDto{
    @IsString()
    @ApiProperty({
        description: 'ID de la POA a cancelar',
        type: String,
        example: "uuid-poa-1234"
    })
    poa_id: string;

    @IsEnum(EstadosActividades)
    @IsString()
    @ApiProperty({
        description: 'Estado anterior de la POA',
        example: EstadosActividades.EN_PROGRESO
    })
    estado_anterior: EstadosActividades;

    @IsEnum(EstadosActividades)
    @ApiProperty({
        description: 'Estado nuevo de la POA',
        example: EstadosActividades.EN_REVISION
    })
    estado_nuevo: EstadosActividades;

    @IsString()
    @ApiProperty({
        description: 'Fecha de cancelación de la POA',
        type: String,
        example: "2026-06-28T19:45:00Z"
    })
    fecha_cancelacion: string;

    @IsString()
    @ApiProperty({
        description: 'Mensaje de cancelación de la POA',
        type: String,
        example: "El envío ha sido cancelado. El POA vuelve a estar disponible para su edición."
    })
    mensaje: string;
}

