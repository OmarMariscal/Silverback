import { ApiProperty } from "@nestjs/swagger";
import { ActividadSugeridaDto } from "./catalogo-banco-sugeridas.dto";

export class ActividadSugeridaDataDto{
    @ApiProperty({
        description: 'Lista de actividades sugeridas',
        type: [ActividadSugeridaDto],
    })
    data: ActividadSugeridaDto[];
}