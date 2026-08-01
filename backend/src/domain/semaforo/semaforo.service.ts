import { EstadosSemaforo } from "./estados-semaforo-enum";
import { SubactividadEntity } from "@domain/subactividades/subactividad.entity";

export class SemaforoService{

    private static calcularDiasHabiles(fechaInicio: Date, fechaActual: Date = new Date()): number{
        let dias = 0;
        const fechaAuxiliar = new Date(fechaInicio.getTime());
        while (fechaAuxiliar<=fechaActual){
            const diasSemana = fechaAuxiliar.getDay();
            if(diasSemana !== 0 && diasSemana !== 6) dias++;
            fechaAuxiliar.setDate(fechaAuxiliar.getDate() + 1);
        }
        return dias;
    }

    public static calcularSemaforo(subactividad: SubactividadEntity): EstadosSemaforo{
        const numeroDias = SemaforoService.calcularDiasHabiles(subactividad.getFechaInicio())

        if(numeroDias<=60) return EstadosSemaforo.A_TIEMPO;
        if(numeroDias<=90) return EstadosSemaforo.PRECAUCION;
        return EstadosSemaforo.CRITICO
        }

    static calcularDias(fechaTermino: Date): number{
        let fechaHoy = new Date()
        let diferencia = fechaTermino.getTime() - fechaHoy.getTime();
        let dias = Math.floor(diferencia/(1000*60*60*24));
        return dias;
    }

    public static obtenerEtiquetaVencimiento(subactividad: SubactividadEntity): string{
        let fechaHoy = new Date()
        let fechaTermino = new Date(subactividad.getFechaConclusionEstimada())
        let meses = fechaTermino.getMonth() - fechaHoy.getMonth();
        if (fechaTermino.getFullYear() > fechaHoy.getFullYear()) {
            meses += 12;
        }
        if (fechaTermino.getDate() < fechaHoy.getDate()) {
            meses--;
        }
        if (meses === 0){
            let dias = SemaforoService.calcularDias(fechaTermino)
            return `Faltan ${dias} dias` 
        }

        return `+${meses} meses`
    }

}