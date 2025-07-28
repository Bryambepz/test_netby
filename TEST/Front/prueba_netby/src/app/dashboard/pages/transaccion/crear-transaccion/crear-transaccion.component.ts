import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Producto } from '../../../../domain/producto';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { TransaccionService } from '../../../../servicios/Transaccion/transaccion.service';
import { TipoTransaccion } from '../../../../domain/tipo-transaccion';
import { CalendarModule } from 'primeng/calendar';
import { ProductoService } from '../../../../servicios/Producto/producto.service';
import { Transaccion } from '../../../../domain/transaccion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-transaccion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ListboxModule,
    CalendarModule
  ],
  templateUrl: './crear-transaccion.component.html',
  styleUrl: './crear-transaccion.component.scss'
})
export class CrearTransaccionComponent implements OnInit{

  transaccionForm: FormGroup;

  productos: Producto[] = [];
  tipoTransaccionLista: TipoTransaccion[] = [];

  constructor(
    private fb: FormBuilder,
    private transaccionService: TransaccionService,
    private productoService: ProductoService
  ){
     this.transaccionForm = this.fb.group({
          fecha: [Date.now, [Validators.required]],
          tipoTransaccion: ['', [Validators.required]],
          producto: ['', [Validators.required]],
          cantidad: [0, [Validators.required, Validators.pattern('[0-9 ]+$'), this.mayorQueCero]],
          precioUnitario: [0, [Validators.required, Validators.pattern('^\\d{1,6}(.\d{1,4})?$'), this.mayorQueCero]],
          precioTotal: [0, [Validators.required, Validators.pattern('^\\d{1,6}(.\d{1,4})?$'), this.mayorQueCero]],
          detalle: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]+$')]],
     });
     this.obtenerTiposTransaccion();
  }
  ngOnInit(): void {
    this.obtenerProductos();
  }

  mayorQueCero(control: AbstractControl): ValidationErrors | null {
    const valor = parseFloat(control.value);
    if (isNaN(valor) || valor <= 0) {
      return { mayorQueCero: true };
    }
    return null;
  }

  guardarTransaccion(){
    if (this.transaccionForm.valid) {
      const _transaccion: Transaccion = this.transaccionForm.value as Transaccion;
      _transaccion.estado = true;
      _transaccion.producto.categoria.productos = [];
      console.log("la transac guarar", _transaccion);
      
      this.transaccionService.guardarTransaccion(_transaccion).subscribe({
        next: (value) => {
          Swal.fire({
            title: value,
            icon: 'success',
          });
          this.transaccionForm.reset();
        }
      })
    }
  }

  obtenerTiposTransaccion() {
    this.transaccionService.obtenerTiposTransaccion().subscribe({
      next: (value) => {
        this.tipoTransaccionLista = value;
      }
    })
  }

  obtenerProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (value) => {
        this.productos = value.productosLista;
      }
    })
  }

  SeleccionaProducto(event: any){
    const productoSeleccionado: Producto = event.value as Producto;
    this.transaccionForm.patchValue({
      precioUnitario: productoSeleccionado.precio
    });
  }

  calculaPrecioTotal(){
    this.transaccionForm.get('cantidad')?.valueChanges.subscribe(valor => {
      console.log('la cantidad es de :', valor);
      const precioU = this.transaccionForm.get('precioUnitario')?.value;
      console.log("el precio", precioU);
      
      this.transaccionForm.patchValue({
        precioTotal: valor * precioU
      });
    });
  }
}
