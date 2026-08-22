import { ApiProperty } from "@nestjs/swagger";
import { DistribucionDto } from "./dashboard-rezago-distribucion.dto";

export class RezagoDto{
    @ApiProperty({
        description: 'ID unico del centro universitario',
        type: String,
        example:"uuid-cucs-999"
    })
    centro_id: string;

    @ApiProperty({
        description: 'Clave del centro universitario',
        type: String,
        example:"CUCS"
    })
    centro_clave: string;

    @ApiProperty({
        description: 'Nombre del centro universitario',
        type: String,
        example:"Centro Universitario de Ciencias de la Salud"
    })
    centro_nombre: string;

    @ApiProperty({
        description: 'Distribucion del centro con rezago',
        type: DistribucionDto
    })
    distribucion: DistribucionDto;
}

