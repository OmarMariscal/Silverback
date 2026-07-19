import { ExceptionFilter } from "@nestjs/common";
import { ReglaNegocioException } from "./regla-negocio.exception";

export class ValidacionIntegridadException extends Error{
    private errores: ReglaNegocioException[];

    constructor(message: string, errores: ReglaNegocioException[]){
        super(message);
        this.name = 'ValidacionIntegridadException'
        this.errores = errores;

        Object.setPrototypeOf(this, ValidacionIntegridadException.prototype)
    }

    get Errores(){
        return this.errores;
    }
}