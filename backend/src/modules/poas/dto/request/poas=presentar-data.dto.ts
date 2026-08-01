import { ApiProperty } from "@nestjs/swagger";
import { PresentarPoasDto } from "./poas-presentar.dto";

export class PresentarPoasDataDto{
    @ApiProperty({ 
        type: PresentarPoasDto 
    })
    data: PresentarPoasDto;
}