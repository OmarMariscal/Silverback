import { ApiProperty } from "@nestjs/swagger";
import { SemaforosDto } from "./dashboard-semaforos.dto";
import { FlujoDto } from "./dashboard-flujo.dto";

export class GraficasDto{
    @ApiProperty({
        description: "Distribucion general del semaforo del contralor",
        type: () => SemaforosDto
    })
    semaforos: SemaforosDto;

    @ApiProperty({
        description: "Flujo de trabajo del contralor",
        type: () => FlujoDto
    })
    flujo: FlujoDto;
}