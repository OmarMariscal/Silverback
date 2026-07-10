import { ApiProperty } from "@nestjs/swagger";
import { TarjetasSuperioresDto } from "./dashboard-jefa-tarjetas-superiores.dto";
import { GraficaSemaforoDto } from "./dashboard-jefa-grafica-semaforo.sto";
import { GraficaDistribucionDto } from "./dashboard-jefa-grafica-distribucion.dto";

export class DashboardJefaDto {
    @ApiProperty({
        description: 'Apartado de tarjetas en el dashboard',
        type: () => TarjetasSuperioresDto,
    })
    tarjetas_superiores: TarjetasSuperioresDto;

    @ApiProperty({
        description: 'Grafica de semaforo',
        type: GraficaSemaforoDto,
    })
    grafica_semaforos: GraficaSemaforoDto;

    @ApiProperty({
        description: 'Grafica de estados',
        type: GraficaDistribucionDto,
    })
    grafica_distribucion_estado: GraficaDistribucionDto;
}
