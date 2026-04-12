import { Component, OnInit, ViewChild } from '@angular/core';
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
import { FileUpload, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { Categoria } from '../../../../domain/categoria';
import { CategoriaService } from '../../../../servicios/Categoria/categoria.service';
import { environment } from '../../../../../environments/environment';
import { Producto } from '../../../../domain/producto';
import Swal from 'sweetalert2';
import { ProductoService } from '../../../../servicios/Producto/producto.service';
import { HttpResponse } from '@angular/common/http';
import { ProductoRequerimiento } from '../../../../domain/producto-requerimiento';
import { CommonModule } from '@angular/common';
import { VerProductoComponent } from "../ver-producto/ver-producto.component";
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Formateadores } from '../../../../shared/validators/formateadores';
import { ConfiguracionImagen } from '../../../../domain/interaces/ConfiguracionImagen';
import { ImagenUtil } from '../../../../shared/Utils/ImagenUtil';
import { ErrorControlComponent } from "../../../componentes/error-control/error-control.component";

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ListboxModule,
    ImageModule,
    FileUploadModule,
    CommonModule,
    ErrorControlComponent
],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.scss',
})
export class CrearProductoComponent implements OnInit{
  @ViewChild('fileUploader') fileUploader!: FileUpload;
  productoForm: FormGroup;
  categorias: Categoria[] = [];
  apiUrlImagen = environment.apiUrlM1 + 'productos/cargarImagen';
  nombreTemporal: string = "";

  imgPrevisualizar: string | ArrayBuffer = "";
  esUpdate: boolean = false;
  archivoProcesado!: File;
  FormateadoresClass = Formateadores;

  errorControlValidador = CustomValidators;
  private url = environment.apiUrlM1 + "imagenes/";
  private _configuracionImagen!: ConfiguracionImagen;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private route: ActivatedRoute,
  ) {
    this.cargarCategorias();
    this.productoForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, CustomValidators.nombre()]],
      descripcion: [
        '',
        [Validators.required, CustomValidators.textoCaracteresEspeciales()],
      ],
      categoria: [
        '',
        [Validators.required],
      ],
      imagen: [''],
      precio: ['0.0', [Validators.required, Validators.pattern('^\\d{1,6}(.\\d{1,4})?$'), this.mayorQueCero]],
      stock: [0, [Validators.required, Validators.pattern('^[0-9 ]+$'), this.mayorQueCero]],
      estado: [true],
    });

    this._configuracionImagen = {
      maxPesoMB: 1,
      maxAnchoCuadrada: 500,
      maxAltoCuadrada: 500,
      maxAnchoHorizontal: 880,
      maxAltoHorizontal: 520,
      maxAnchoVertical: 520,
      maxAltoVertical: 880,
      formatoSalida: 'image/webp',
      calidad: 0.8
    };
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if ( id != null ) {
      // console.log("reciv", id)
      this.esUpdate = true;
      this.obtenerProductoActualizar(Number(id));
    }
  }

  mayorQueCero(control: AbstractControl): ValidationErrors | null {
    const valor = parseFloat(control.value);
    if (isNaN(valor) || valor < 0) {
      return { mayorQueCero: true };
    }
    return null;
  }

  guardarProducto() {
    // console.log("form de producto", this.productoForm);
    
    if (this.productoForm.valid) {
      const _producto: Producto = this.productoForm.value as Producto;
      // console.log("producto", _producto);
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
      if ( !this.esUpdate ) {
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
      } else {
        this.productoService.actualizarProducto(productoGuarda).subscribe({
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
  }

  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (value) => {
        // console.log('las categorias', value);

        this.categorias = value;
      },
    });
  }

  subirImagenManual(): void {
    if (!this.archivoProcesado) {
      Swal.fire({
        title: 'Sin imagen',
        text: 'Primero selecciona una imagen válida.',
        icon: 'warning'
      });
      return;
    }

    const formData = new FormData();
    formData.append('imagen', this.archivoProcesado);

    this.productoService.cargarImagen(formData).subscribe({
      next: (resp) => {
        this.nombreTemporal = resp.imageUrl;

        Swal.fire({
          title: 'Imagen cargada',
          icon: 'success'
        });

      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo subir la imagen.',
          icon: 'error'
        });
      }
    })
  }  

  // cargarImagen(event: FileUploadEvent) {
  //   // console.log("el event", event);
  //   const original = event.originalEvent as  HttpResponse<any>;
  //   console.log("origjn", original!.body.imageUrl);
    
  //   this.nombreTemporal = original!.body.imageUrl;
  //   Swal.fire({
  //     title: "Imagen cargada",
  //     // text: "Presione nuevamente el boton de cargar para guardar el archivo",
  //     icon: "success"
  //   });
  // }

  async seleccionaArchivo(event: any) {
    const imgSeleccionada = event.files[0];

    if (!imgSeleccionada) {
      return;
    }

    const formatosPermitidos = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!formatosPermitidos.includes(imgSeleccionada.type)) {
      Swal.fire({
        title: 'Formato no permitido',
        text: 'Solo se permiten imágenes JPG, JPEG, PNG o WEBP.',
        icon: 'error'
      });
      this.reiniciarUploader();
      return;
    }

    try {
      const imagenProcesada = await ImagenUtil.procesarImagen(
        imgSeleccionada,
        this._configuracionImagen
      );

      this.archivoProcesado = imagenProcesada;

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
    } catch (error) {
      Swal.fire({
        title: 'Error al procesar imagen',
        text: 'No se pudo optimizar la imagen seleccionada.',
        icon: 'error'
      });
      this.reiniciarUploader();
    }
  }

  errorCargaImagen(event: any) {
    Swal.fire({
      title: "Imagen pesada",
      text: "Cargue otro archivo cuyo peso sea mas liviano. Pruebe con otra imagen",
      icon: "error"
    });
    this.reiniciarUploader();
  }

  reiniciarUploader() {
    if (this.fileUploader) {
      this.fileUploader.clear();
    }
  }

  obtenerProductoActualizar(id: number){
    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (value) => {
        console.log("el prid", value);
        
        this.productoForm.patchValue(value);
        var categoria: Categoria = this.productoForm.get('categoria')?.value as Categoria;
        // console.log("form", categoria);
        this.productoForm.get('categoria')?.setValue(categoria);
        this.productoForm.patchValue({
          categoria: categoria
        });
        this.imgPrevisualizar = this.url+this.productoForm.get('imagen')?.value
      }
    })
  }
}
