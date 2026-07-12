import { EstadosActividades } from "./estados-actividades.enum";
import { Roles } from "@domain/roles/roles.enum";
import { ReglaNegocioException } from "@domain/excepciones/regla-negocio.exception";
import { EstadosPoa } from "@domain/poa/poa-estados.enum";
import { TipoSubActividad } from "./tipos-de-actividades.enum";

export class ActividadEntity{
    constructor(
        private estado: EstadosActividades, 
        private estadoPoa: EstadosPoa,
        private detalles: string,
        private tipo: TipoSubActividad,
        private fechaConclusion: Date,
        private fechaInicio: Date
    ){

    }

    solicitar(rolUsuario: Roles){
        if(this.estado != EstadosActividades.SIN_EMPEZAR){
            throw new ReglaNegocioException("Solo se puede solicitar aprobacion de actividades sin empezar")
        }

        if(rolUsuario!= Roles.CONTRALOR){
            throw new ReglaNegocioException("Solo usuarios contralores pueden solicitar aprobacion.")
        }

        if(this.estadoPoa != EstadosPoa.ACEPTADA)

        this.estado = EstadosActividades.SOLICITADO
    }

    aprobar(rolUsuario: Roles){
        if(this.estado!= EstadosActividades.SOLICITADO){
            throw new ReglaNegocioException("Solo se pueden aprobar actividades que hayan sido soicitadas.")
        }

        if(rolUsuario!=Roles.JEFA){
            throw new ReglaNegocioException("Solo la jefa puede aprobar actividades solicitadas.")
        }

        this.estado = EstadosActividades.EN_PROGRESO
    }

    enviar(rolUsuario: Roles){

        if(this.estado != EstadosActividades.EN_PROGRESO || EstadosActividades.DEVUELTA){
            throw new ReglaNegocioException("Solo se pueden enviar actividades en progreso.")
        }

        if(rolUsuario != Roles.CONTRALOR || Roles.AUDITOR){
            throw new ReglaNegocioException("Solo los contralores o auditores autorizados pueden enviar tareas.")
        }

        this.estado = EstadosActividades.EN_REVISION
    }

    devolver(rolUsuario: Roles){
        if(this.estado != EstadosActividades.EN_REVISION){
            throw new ReglaNegocioException("Solo se pueden devolver actividades que esten siendo revisadas.")
        }

        if(rolUsuario != Roles.JEFA){
            throw new ReglaNegocioException("Solo la jefa tiene permiso para devolver tareas.")
        }

        if(this.tipo == TipoSubActividad.AUDITORIA){
            if(this.detalles == null){
                throw new ReglaNegocioException("No puede devolver la tarea sin al menos una observacion.")
            }
        }

        if(this.tipo == TipoSubActividad.REVISION){
            if(this.detalles == null){
                throw new ReglaNegocioException("No se puede devolver la tarea sin al menos una recomendacion.")
            }
        }
    }

    concluir(rolUsuario: Roles){
        if(this.estado != EstadosActividades.EN_REVISION){
            throw new ReglaNegocioException("Solo se pueden concluir actividades que esten siendo revisadas.")
        }

        if(rolUsuario != Roles.JEFA){
            throw new ReglaNegocioException("Solo la jefa tiene autorizacion para concluir una actividad.")
        }

        this.estado = EstadosActividades.CONCLUIDA
    }
    
}