import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Categoria } from '../../../../domain/categoria';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CategoriaService } from '../../../../servicios/Categoria/categoria.service';
import Swal from 'sweetalert2';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-categoria-producto',
  standalone: true,
  imports: [ButtonModule, TableModule, ReactiveFormsModule,],
  templateUrl: './categoria-producto.component.html',
  styleUrl: './categoria-producto.component.scss'
})
export class CategoriaProductoComponent implements OnInit{

  categoriaForm: FormGroup;
  categorias: Categoria[] = [];

  totalCategorias: number = 0;
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
    private categoriaService: CategoriaService
  ){
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+$')]],
      estado: [true]
    });
  }
  ngOnInit(): void {
    this.cargarCategorias(null);
  }

  guardarCategoria(){
    if (this.categoriaForm.valid) {
      const categoriaGuarda: Categoria = this.categoriaForm.value as Categoria;
      // console.log('Datos enviados:', this.categoriaForm.value);
      this.categoriaService.guardarCategoria(categoriaGuarda).subscribe({
        next(value) {
          Swal.fire({
            title: "Categoría Creada",
            icon: "success"
          });
        },
        complete: () => {
          this.categoriaForm.reset({
            estado: true
          });
          this.cargarCategorias(null);
        }
      })
    } 
    // else {
    //   console.log('Formulario inválido');
    // }
  }

  // obtenerCategorias(){
    
  // }

  cargarCategorias(event: TableLazyLoadEvent | null) {
    this.cargando = true;

    const pagina = (event?.first ?? 0) / (event?.rows ?? 10) + 1;
    const tamano = event?.rows ?? 10;
    // console.log("la pagina", pagina);
    // console.log("el tama;o", tamano);
    
    this.categoriaService.obtenerCategoriasPaginacion(pagina, tamano).subscribe({
      next: (value) => {
          this.totalCategorias = value.totalCategorias;
          this.categorias = value.categorias;
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}
