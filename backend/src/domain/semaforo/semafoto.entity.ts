import { EstadosSemaforo } from "./estados-semaforo-enum";

export class SemafotoEntity{
    constructor(
        private fechaInicio: Date,
        private fechaHoy: Date = new Date()
    ){
        this.calcularSemaforo(new Date())
    }

    private calcularDiasHabiles(fechaActual: Date): number{
        let dias = 0;
        const fechaAuxiliar = new Date(this.fechaInicio.getTime());
        while (fechaAuxiliar<=fechaActual){
            const diasSemana = fechaAuxiliar.getDay();
            if(diasSemana !== 0 && diasSemana !== 6) dias++;
            fechaAuxiliar.setDate(fechaAuxiliar.getDate() + 1);
        }
        return dias;
    }

    public calcularSemaforo(fechaActual: Date): EstadosSemaforo{
        const numeroDias = this.calcularDiasHabiles(fechaActual)

        if(numeroDias<=60) return EstadosSemaforo.A_TIEMPO;
        if(numeroDias<=90) return EstadosSemaforo.PRECAUCION;
        return EstadosSemaforo.CRITICO
        }

    public obtenerEstado(): EstadosSemaforo{
        return this.calcularSemaforo(new Date());
    }

}