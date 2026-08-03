import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class BancoIdDto {

    @IsString()
    @IsUUID()
    @ApiProperty({
        description: 'ID del banco de actividades',
        type: String,
        example: "banco-uuid-1"
    })
    id: string;

    @IsString()
    @ApiProperty({
        description: 'Titulo de la actividad',
        type: String,
        example: "Revisión al rubro de Obra Pública"
    })
    titulo: string;

    @IsString()
    @ApiProperty({
        description: 'Justificación de la actividad',
        type: String,
        example: "Verificar el adecuado cumplimiento a los procedimientos relativos a la planeación, programación..."
    })
    justificacion_plantilla: string;

    @IsString()
    @ApiProperty({
        description: 'Objetivo general de la actividad',
        type: String,
        example: "Asegurar la correcta aplicación de los recursos destinados a la obra pública..."
    })
    objetivo_gen_plantilla: string;
}