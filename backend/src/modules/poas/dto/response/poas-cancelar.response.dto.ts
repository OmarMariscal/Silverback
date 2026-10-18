import { ApiProperty } from '@nestjs/swagger';
import { CancelarPoaDataDto } from './poas-cancelar-data.dto';

export class CancelarPoaResponseaDto {
  @ApiProperty({
    type: CancelarPoaDataDto,
  })
  data: CancelarPoaDataDto;
}
