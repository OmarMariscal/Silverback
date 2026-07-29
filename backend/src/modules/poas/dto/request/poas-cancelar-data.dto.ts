import { ApiProperty } from "@nestjs/swagger";
import { CancelarPoaDto } from "./poas-cancelar.dto";

export class CancelarPoaDataDto{
    @ApiProperty({
        type: CancelarPoaDto
    })
    data: CancelarPoaDto;
}