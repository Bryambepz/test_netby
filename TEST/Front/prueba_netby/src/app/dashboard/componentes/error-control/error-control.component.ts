import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FormErrorUtil } from '../../../shared/Utils/FormErrorUtil';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-control.component.html',
  styleUrl: './error-control.component.scss'
})
export class ErrorControlComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input() label: string = '';

  get control(): AbstractControl | null {
    return this.form.get(this.controlName);
  }

  get mostrarError(): boolean {
    return FormErrorUtil.controlInvalido(this.form, this.controlName);
  }

  get mensajeError(): string {
    return FormErrorUtil.obtenerMensajeError(this.control, this.label);
  }
}
