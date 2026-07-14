import { Roles } from "@domain/roles/roles.enum";
import { EstadosPoa } from "./poa-estados.enum";
import { ReglaNegocioException } from "@domain/excepciones/regla-negocio.exception";


export class PoaEntity{
    constructor(
        private estado: EstadosPoa,
        private actividadesPoa: string,
        private comentarios: string 
    ){}

    enviar(rolUsuario: Roles){
        if(this.estado != EstadosPoa.BORRADOR && this.estado != EstadosPoa.DEVUELTA){
            throw new ReglaNegocioException("Solo se pueden enviar POAs que esten en borrador.")
        }

        if(rolUsuario != Roles.CONTRALOR){
            throw new ReglaNegocioException("Solo el contralor puede mandar la POA a revisar.")
        }

        if(this.actividadesPoa == null){
            throw new ReglaNegocioException("La POA tiene que tener al menos una actividad registrada.")
        }

        this.estado = EstadosPoa.EN_REVISION
    }

    devolver(rolUsuario: Roles){
        if(this.estado != EstadosPoa.EN_REVISION){
            throw new ReglaNegocioException("Solo se pueden devolver POAs que esten siendo revisadas.")
        }

        if(rolUsuario != Roles.JEFA){
            throw new ReglaNegocioException("Solo la jefa puede devolver POAs")
        }

        if(this.comentarios == null){
            throw new ReglaNegocioException("Para devolver la actividad tuvo que haber agregado comentarios.")
        }

        this.estado = EstadosPoa.DEVUELTA
    }

    aceptar(rolUsuario: Roles){

         if(this.estado != EstadosPoa.EN_REVISION){
            throw new ReglaNegocioException("No se pueden aceptar POAs que no esten siendo revisadas.")
        }

        if(rolUsuario != Roles.JEFA){
            throw new ReglaNegocioException("Solo la jefa puede aceptar POAs.")
        }

       this.estado = EstadosPoa.ACEPTADA
    }
}