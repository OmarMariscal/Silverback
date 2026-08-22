import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString, IsUUID } from "class-validator";
import { TipoSubActividad } from "@domain/actividad/tipos-de-actividades.enum";

export class BancoActividadesDto{

    @IsString()
    @IsUUID()
    @ApiProperty({
        description: 'ID de la actividad',
        type: String,
        example: "banco-uuid-1"
    })
    id: string;

    @IsString()
    @IsEnum(TipoSubActividad)
    @ApiProperty({
        description: 'Tipo de actividad',
        example: TipoSubActividad.AUDITORIA
    })
    tipo: TipoSubActividad;

    @IsString()
    @ApiProperty({
        description: 'Titulo de la actividad',
        type: String,
        example: "Revision al rubro de Obra Publica"
    })
    titulo: string;

    @IsString()
    @ApiProperty({
        description: 'Explicacion breve de la actividad',
        type: String,
        example: "Verificar el adecuado cumplimiento de los procedimientos relativos a la..."
    })
    descripcion_corta: string;

}

