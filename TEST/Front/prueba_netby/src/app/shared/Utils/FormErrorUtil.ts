import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export class FormErrorUtil {

  static obtenerMensajeError(control: AbstractControl | null, nombreCampo?: string): string {
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    
    const errors: ValidationErrors = control.errors;

    if (errors['required']) {
      return `El campo ${nombreCampo ?? ''} es obligatorio.`.trim();
    }

    if (errors['minlength']) {
      return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
    }

    if (errors['maxlength']) {
      return `No debe superar los ${errors['maxlength'].requiredLength} caracteres.`;
    }

    if (errors['pattern']) {
      return `El formato ingresado no es válido.`;
    }

    if (errors['min']) {
      return `El valor mínimo permitido es ${errors['min'].min}.`;
    }

    if (errors['max']) {
      return `El valor máximo permitido es ${errors['max'].max}.`;
    }

    if (errors['nombre']) {
      return `El texto ingresado no es válido.`;
    }

    if (errors['textoCaracteresEspeciales']) {
      return `El texto contiene caracteres no permitidos.`;
    }

    if (errors['mayorQueCero']) {
      return `El valor debe ser mayor que cero.`;
    }

    return `El campo no es válido.`;
  }

  static controlInvalido(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}