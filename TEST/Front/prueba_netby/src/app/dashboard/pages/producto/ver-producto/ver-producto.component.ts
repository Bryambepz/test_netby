import { Component, OnInit } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Producto } from '../../../../domain/producto';
import { ProductoService } from '../../../../servicios/Producto/producto.service';
import { environment } from '../../../../../environments/environment';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { FilterMatchMode } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-ver-producto',
  standalone: true,
  imports: [TableModule, ImageModule, ButtonModule, InputTextModule ],
  templateUrl: './ver-producto.component.html',
  styleUrl: './ver-producto.component.scss'
})
export class VerProductoComponent implements OnInit{
  apiUrlImagen = environment.apiUrlM1 + 'imagenes/';
  
  productos: Producto[] = [];
  totalProductos: number = 0;
  cargando: boolean = false;

  constructor(
    private productoService: ProductoService
  ){

  }
  ngOnInit(): void {
    this.cargarProductos(null);
  }

  cargarProductos(event: TableLazyLoadEvent | null){
    this.cargando = true;

    const pagina = (event?.first ?? 0) / (event?.rows ?? 10) + 1;
    const tamano = event?.rows ?? 10;
    console.log("la pagina", pagina);
    console.log("el tama;o", tamano);
    
    this.productoService.obtenerProductoPaginacion(pagina, tamano).subscribe({
      next: (value) => {
        console.log("respue", value);
        
          this.totalProductos = value.totalProductos;
          this.productos = value.productosLista;
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}
