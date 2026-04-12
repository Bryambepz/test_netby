import { FormGroup } from "@angular/forms";

export class Formateadores
{
    static ingresaValorNumerico(event: any, formulario: FormGroup, elemento: string) : void{
        const input = event.target;
    
        // Solo números
        let value = input.value.replace(/\D/g, '');
    
        // Guardamos buffer
        const precioFormatear: string = value;
    
        // Convertimos a decimal (2 decimales)
        const numero = (parseInt(precioFormatear || '0', 10) / 100).toFixed(2);
    
        // Actualizamos el input visual
        input.value = numero;
    
        // Actualizamos el formControl
        formulario.get(elemento)?.setValue(numero, { emitEvent: false });
    }
}