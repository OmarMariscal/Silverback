import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { TipoSubActividad } from "@domain/actividad/tipos-de-actividades.enum";

export class ActividadSugeridaDto{
    @IsString()
    @IsUUID()
    @ApiProperty({
        description: 'ID de la actividad sugerida',
        type: String,
        example: "actividad-uuid-1"
    })
    id: string;

    @IsString()
    @ApiProperty({
        description: 'Descripcion de la actividad sugerida',
        type: String,
        example: "Elaborar acta circunstanciada para desincorporar del Patrimonio..."
    })
    descripcion: string;

    @IsString()
    @IsEnum(TipoSubActividad)
    @ApiProperty({
        description: 'Que tipo de actividad es la sugerida',
        example: TipoSubActividad.AUDITORIA
    })
    tipo_sugerido: TipoSubActividad;
}

