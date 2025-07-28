import { Component, OnInit } from '@angular/core';
import { Transaccion } from '../../../../domain/transaccion';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TransaccionService } from '../../../../servicios/Transaccion/transaccion.service';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    private transaccionService: TransaccionService,
    private router: Router,
  ){
  }

  ngOnInit(): void {
    this.cargarTransaccion(null);
  }

  emitirId(id: number) {
    // console.log("se emite", id);
    this.router.navigate(['dashboard/transaccion/transaccion-crear', id]);
  }

  cargarTransaccion(event: TableLazyLoadEvent | null){
    this.cargando = true;

    const pagina = (event?.first ?? 0) / (event?.rows ?? 10) + 1;
    const tamano = event?.rows ?? 10;
    // console.log("la pagina", pagina);
    // console.log("el tama;o", tamano);
    
    this.transaccionService.obtenerTransaccionPaginacion(pagina, tamano).subscribe({
      next: (value) => {
        // console.log("respue", value);
        
          this.totalTransacciones = value.totalTransacciones;
          this.transacciones = value.transaccionesLista;
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

  eliminarTransaccion(id: number){
    Swal.fire({
      title: "Esta seguro de eliminar este producto?",
      text: "El producto no se volvera a visualizar en el sistema",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No, Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.transaccionService.eliminarTransaccion(id).subscribe({
          next: (value) => {
            Swal.fire({
              title: "Eliminado",
              text: value,
              icon: "success"
            });
            this.cargarTransaccion(null);
          }
        })
      }
    });
  }
}
