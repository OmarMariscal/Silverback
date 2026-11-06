import { ApiProperty } from "@nestjs/swagger";
import { RezagoDto } from "./dashboard-rezago.dto";

export class RezagoDataDto{
    @ApiProperty({
        description: 'Lista de los centros rezagados',
        type: [RezagoDto]
    })
    data: RezagoDto[];
}