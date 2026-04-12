import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Nombre (solo letras + espacios + caracteres español)
  static nombre(): ValidatorFn {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9 ]+$/;

    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      return regex.test(control.value) ? null : { nombreInvalido: true };
    };
  }

  // Nombre (solo letras + espacios + caracteres español) para texto
  static textoCaracteresEspeciales(): ValidatorFn {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ#$0-9 ]+$/;

    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      return regex.test(control.value) ? null : { nombreInvalido: true };
    };
  }

  static patternValidator(regex: RegExp, errorName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      return regex.test(control.value) ? null : { [errorName]: true };
    };
  }

  static controlInvalido(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
