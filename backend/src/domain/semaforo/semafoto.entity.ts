import { EstadosSemaforo } from "./estados-semaforo-enum";

export class SemafotoEntity{
    constructor(
        private fechaInicio: Date,
    ){
        this.calcularSemaforo(new Date())
    }

    calcularDiasHabiles(fechaActual: Date): number{
        let dias = 0;
        const fechaAuxiliar = new Date(this.fechaInicio.getTime());
        while (fechaAuxiliar<=fechaActual){
            const diasSemana = fechaAuxiliar.getDay();
            if(diasSemana !== 0 && diasSemana !== 6) dias++;
            fechaAuxiliar.setDate(fechaAuxiliar.getDate() + 1);
        }
        return dias;
    }

    calcularSemaforo(fechaActual: Date): EstadosSemaforo{
        const numeroDias = this.calcularDiasHabiles(fechaActual)

        if(numeroDias<=60) return EstadosSemaforo.A_TIEMPO;
        if(numeroDias<=90) return EstadosSemaforo.PRECAUCION;
        return EstadosSemaforo.CRITICO
        }

    obtenerEstado(): EstadosSemaforo{
        return this.calcularSemaforo(new Date());
    }

}