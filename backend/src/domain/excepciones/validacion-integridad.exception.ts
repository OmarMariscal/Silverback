export class ValidacionIntegridadException extends Error{
    constructor(message: string){
        super(message);
        this.name = 'ValidacionIntegridadException'

        Object.setPrototypeOf(this, ValidacionIntegridadException)
    }
}