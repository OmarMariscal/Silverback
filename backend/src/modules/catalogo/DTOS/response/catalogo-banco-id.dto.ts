import { ApiProperty } from "@nestjs/swagger";

export class BancoIdDto {
    @ApiProperty({
        description: 'ID del banco de actividades',
        type: String,
        example: "banco-uuid-1"
    })
    id: string;

    @ApiProperty({
        description: 'Titulo de la actividad',
        type: String,
        example: "Revisión al rubro de Obra Pública"
    })
    titulo: string;

    @ApiProperty({
        description: 'Justificación de la actividad',
        type: String,
        example: "Verificar el adecuado cumplimiento a los procedimientos relativos a la planeación, programación..."
    })
    justificacion_plantilla: string;

    @ApiProperty({
        description: 'Objetivo general de la actividad',
        type: String,
        example: "Asegurar la correcta aplicación de los recursos destinados a la obra pública..."
    })
    objetivo_gen_plantilla: string;
}