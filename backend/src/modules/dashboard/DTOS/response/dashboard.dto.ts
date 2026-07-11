import { ApiProperty } from "@nestjs/swagger";
import { CentroUniversitarioDto } from "./dashboard-centro.dto";
import { TarjetasDto } from "./dashboard-tarjetas.dto";
import { GraficasDto } from "./dashboard-graficas.dto";

export class DashboardDto {
    @ApiProperty({
        description: "Apartado de centros universitarios",
        type: () => CentroUniversitarioDto,
    })
    centro_universitario: CentroUniversitarioDto;

    @ApiProperty({
        description: "Apartado de tarjetas de información",
        type: () => TarjetasDto
    })
    tarjetas: TarjetasDto;

    @ApiProperty({
        description: "Apartado de gráficas",
        type: () => GraficasDto
    })
    graficas: GraficasDto;
}