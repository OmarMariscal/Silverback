import { ApiProperty } from "@nestjs/swagger";

export class ActividadesResumenDto{

    @ApiProperty({
        description: "ID unico de la actividad",
        type: String,
        example: "act-01-uuid"
    })
    id: string;

    @ApiProperty({
        description: "Numero de folio de la actividad",
        type: String,
        example: "01"
    })
    folio: string;

    @ApiProperty({
        description: "Titulo de la actividad",
        type: String,
        example: "Abatir el rezago en la solventación..."
    })
    titulo: string;

    @ApiProperty({
        description: "Porcentaje de participacion en la actividad",
        type: Number,
        example: 50
    })
    participacion_global: number;

    @ApiProperty({
        description: "Lista con nombres de los auditores",
        type: [String],
        example: ["Lic. Auditor Auxiliar", "Mtro. Titular"]
    })
    auditores_nombres: string[];
}