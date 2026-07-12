export class ReglaNegocioException extends Error{
    constructor(message: string){
        super(message);
        this.name = 'ReglaNegocioException';

        Object.setPrototypeOf(this, ReglaNegocioException)
    }
}