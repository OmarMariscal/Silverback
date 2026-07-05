import { ApiProperty } from "@nestjs/swagger";

export enum Estado{
    sin_enviar = "SIN ENVIAR",
    en_revision = "EN REVISION",
    devuelta = "DEVUELTA",
    aceptada = "ACEPTADA",
    borrador = "BORRADOR"
}

class ActividadesResumenDto{

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

export class PoaActualDto{

    @ApiProperty({
        description: "ID unico de la POA actual",
        type: String,
        example: "poa-2026-uuid"
    })
    id: string;

    @ApiProperty({
        description: "Anio fiscal en la que se encuentra la POA",
        type: Number,
        example: 2026
    })
    anio_fiscal: number;

    @ApiProperty({
        enum: ["SIN ENVIAR", "EN REVISION", "DEVUELTA", "ACEPTADA", "BORRADOR"],
        description: "Estado de la actividad(enum)",
        example: "BORRADOR"
    })
    estado: Estado;

    @ApiProperty({
        description: "Lista de acrividades de manera resumida",
        type: [ActividadesResumenDto],
        // example: `
        //         [
        //     {
        //     "id": "act-01-uuid",
        //     "folio": "01",
        //     "titulo": "Abatir el rezago en la solventación...",
        //     "participacion_global": 50,
        //     "auditores_nombres": ["Lic. Auditor Auxiliar", "Mtro. Titular"]
        //     },
        // `
    })
    actividades_resumen: ActividadesResumenDto[]; 
}