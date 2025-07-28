import { Component, OnInit } from '@angular/core';
import { Transaccion } from '../../../../domain/transaccion';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TransaccionService } from '../../../../servicios/Transaccion/transaccion.service';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ver-transaccion',
  standalone: true,
  imports: [TableModule, DatePipe, ButtonModule],
  templateUrl: './ver-transaccion.component.html',
  styleUrl: './ver-transaccion.component.scss'
})
export class VerTransaccionComponent implements OnInit{

  transacciones: Transaccion[] = [];
  totalTransacciones: number = 0;
  cargando: boolean = false;

  constructor(
    private transaccionService: TransaccionService
  ){
  }

  ngOnInit(): void {
    this.cargarTransaccion(null);
  }

  cargarTransaccion(event: TableLazyLoadEvent | null){
    this.cargando = true;

    const pagina = (event?.first ?? 0) / (event?.rows ?? 10) + 1;
    const tamano = event?.rows ?? 10;
    console.log("la pagina", pagina);
    console.log("el tama;o", tamano);
    
    this.transaccionService.obtenerTransaccionPaginacion(pagina, tamano).subscribe({
      next: (value) => {
        console.log("respue", value);
        
          this.totalTransacciones = value.totalTransacciones;
          this.transacciones = value.transaccionesLista;
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}
