import { ApiProperty } from "@nestjs/swagger";
import { BancoActividadesDto } from "./catalogo-banco.dto";

export class BancoActividadesDataDto{

    @ApiProperty({
        description: 'Lista de actividades',
        type: [BancoActividadesDto],
    })
    data: BancoActividadesDto[];
}