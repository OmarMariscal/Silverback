import { ApiProperty } from "@nestjs/swagger";

export class PresentarPoasResponseErrorDto{
    @ApiProperty({
        description: 'Titulo del error',
        type: String,
        example: "Validación de Integridad Fallida"
    })
    error: string;

    @ApiProperty({
        description: 'Descripcion del error',
        type: String,
        example: "No es posible enviar un POA vacío."
    })
    message: string;

    @ApiProperty({
        description: 'Detalles a solucionar para resolver el error',
        type: [String],
        example: [
    "El POA debe contener al menos 1 actividad registrada.",
    "Existen sub-actividades sin un auditor responsable asignado."
  ]
    })
    detalles: string;

}