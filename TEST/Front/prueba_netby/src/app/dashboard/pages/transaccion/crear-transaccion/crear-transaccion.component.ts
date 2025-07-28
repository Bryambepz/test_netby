import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../../../domain/producto';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-crear-transaccion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ListboxModule,
  ],
  templateUrl: './crear-transaccion.component.html',
  styleUrl: './crear-transaccion.component.scss'
})
export class CrearTransaccionComponent {

  transaccionForm: FormGroup;

  productos: Producto[] = [];

  constructor(
    private fb: FormBuilder
  ){
     this.transaccionForm = this.fb.group({
          nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+$')]],
          descripcion: []
     });
  }

  guardarTransaccion(){

  }
}
