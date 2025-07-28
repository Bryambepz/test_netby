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
import { ActivatedRoute } from '@angular/router';

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
  esUpdate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private transaccionService: TransaccionService,
    private productoService: ProductoService,
    private route: ActivatedRoute,
  ){
     this.transaccionForm = this.fb.group({
      id: [0],
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
    const id = this.route.snapshot.paramMap.get('id');
    if ( id != null ) {
      // console.log("reciv", id)
      this.esUpdate = true;
      this.obtenerTransaccionActualizar(Number(id));
    }
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
      // console.log("la transac guarar", _transaccion);
      if ( !this.esUpdate ) {
        this.transaccionService.guardarTransaccion(_transaccion).subscribe({
          next: (value) => {
            Swal.fire({
              title: value,
              icon: 'success',
            });
            this.transaccionForm.reset();
          }
        });
      } else {
        this.transaccionService.actualizarTransaccion(_transaccion).subscribe({
          next: (value) => {
            Swal.fire({
              title: value,
              icon: 'success',
            });
            this.transaccionForm.reset();
          }
        });
      }
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
        // console.log("los prod", value.productosLista);
        
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
      // console.log('la cantidad es de :', valor);
      const precioU = this.transaccionForm.get('precioUnitario')?.value;
      // console.log("el precio", precioU);
      
      this.transaccionForm.patchValue({
        precioTotal: valor * precioU
      });
    });
  }

  obtenerTransaccionActualizar(id: number){
    this.transaccionService.obtenerTransaccionPorId(id).subscribe({
      next: (value) => {
        // console.log("el prid", value);
        
        this.transaccionForm.patchValue(value);
        // var categoria: Categoria = this.productoForm.get('categoria')?.value as Categoria;
        // console.log("form", this.transaccionForm);
        const fechaString = this.transaccionForm.get("fecha")?.value;
        const fechaDate = new Date(fechaString);
        // console.log("la fecha", fechaDate);
        this.transaccionForm.patchValue({
          fecha: fechaDate
        });
        // this.productoForm.get('categoria')?.setValue(categoria);
        // this.productoForm.patchValue({
        //   categoria: categoria
        // });
        // this.imgPrevisualizar = 'http://localhost:5196/api/imagenes/'+this.productoForm.get('imagen')?.value
      }
    })
  }
}
