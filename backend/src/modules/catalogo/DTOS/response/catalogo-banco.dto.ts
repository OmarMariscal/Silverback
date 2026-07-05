import { ApiProperty } from "@nestjs/swagger";

class BancoActividadesDto{
    @ApiProperty({
        description: 'ID de la actividad',
        type: Number,
        example: "banco-uuid-1"
    })
    id: number;

    @ApiProperty({
        description: 'Tipo de actividad',
        type: String,
        example: "AUDITORIA"
    })
    tipo: string;

    @ApiProperty({
        description: 'Titulo de la actividad',
        type: String,
        example: "Revision al rubro de Obra Publica"
    })
    titulo: string;

    @ApiProperty({
        description: 'Explicacion breve de la actividad',
        type: String,
        example: "Verificar el adecuado cumplimiento de los procedimientos relativos a la..."
    })
    descripcion_corta: string;

}

export class BancoActividadesDataDto{

    @ApiProperty({
        description: 'Lista de actividades',
        type: [BancoActividadesDto],
        example: [{
            id: 1,
            tipo: "AUDITORIA",
            titulo: "Revision al rubro de Obra Publica",
            descripcion_corta: "Verificar el adecuado cumplimiento de los procedimientos relativos a la..."
        }]
    })
    data: BancoActividadesDto[];
}