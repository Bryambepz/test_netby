import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { ImageModule } from 'primeng/image';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { Categoria } from '../../../../domain/categoria';
import { CategoriaService } from '../../../../servicios/Categoria/categoria.service';
import { environment } from '../../../../../environments/environment';
import { Producto } from '../../../../domain/producto';
import Swal from 'sweetalert2';
import { ProductoService } from '../../../../servicios/Producto/producto.service';
import { HttpResponse } from '@angular/common/http';
import { ProductoRequerimiento } from '../../../../domain/producto-requerimiento';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ListboxModule,
    ImageModule,
    FileUploadModule,
    CommonModule
  ],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.scss',
})
export class CrearProductoComponent {
  productoForm: FormGroup;
  categorias: Categoria[] = [];
  apiUrlImagen = environment.apiUrlM1 + 'productos/cargarImagen';
  nombreTemporal: string = "";

  imgPrevisualizar: string | ArrayBuffer = "";

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
  ) {
    this.cargarCategorias();
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+$')]],
      descripcion: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z0-9 ]+$')],
      ],
      categoria: [
        '',
        [Validators.required],
      ],
      imagen: [''],
      precio: [0.0, [Validators.required, Validators.pattern('^\\d{1,6}(.\\d{1,4})?$'), this.mayorQueCero]],
      stock: [0, [Validators.required, Validators.pattern('[0-9 ]+$'), this.mayorQueCero]],
      estado: [true],
    });
  }

  mayorQueCero(control: AbstractControl): ValidationErrors | null {
    const valor = parseFloat(control.value);
    if (isNaN(valor) || valor <= 0) {
      return { mayorQueCero: true };
    }
    return null;
  }
  guardarProducto() {
    console.log("form de producto", this.productoForm);
    
    if (this.productoForm.valid) {
      const _producto: Producto = this.productoForm.value as Producto;
      console.log("producto", _producto);
      if ( this.nombreTemporal == "" ) {
        Swal.fire({
          title: "No imagen",
          text: "No se ha cargado una imagen",
          icon: "warning"
        });
        return;
      }
      _producto.imagen = "";
      _producto.estado = true;
      const productoGuarda: ProductoRequerimiento = {
        productos: _producto,
        imagenNombre: this.nombreTemporal
      };
      // console.log('Datos enviados:', this.categoriaForm.value);
      this.productoService.guardarProducto(productoGuarda).subscribe({
        next: (value) => {
          Swal.fire({
            title: value,
            icon: 'success',
          });
          this.productoForm.reset();
          this.nombreTemporal = "";
          this.imgPrevisualizar = "";
        },
      });
    }
  }

  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (value) => {
        console.log('las categorias', value);

        this.categorias = value;
      },
    });
  }

  cargarImagen(event: FileUploadEvent) {
    console.log("el event", event);
    const original = event.originalEvent as  HttpResponse<any>;
    console.log("origjn", original!.body.imageUrl);
    
    this.nombreTemporal = original!.body.imageUrl;
    Swal.fire({
      title: "Imagen cargada",
      // text: "Presione nuevamente el boton de cargar para guardar el archivo",
      icon: "success"
    });
  }

  seleccionaArchivo(event: any) {
    const imgSeleccionada = event.files[0];
    const leerImg = new FileReader();
    leerImg.onload = () => {
      this.imgPrevisualizar = leerImg.result ?? "";
    }
    leerImg.readAsDataURL(imgSeleccionada);

    Swal.fire({
      title: "Imagen lista",
      text: "Presione nuevamente el boton de cargar para guardar el archivo",
      icon: "success"
    });
  }
}
