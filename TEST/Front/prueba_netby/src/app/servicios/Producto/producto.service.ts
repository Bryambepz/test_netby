import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../domain/producto';
import { ProductoRequerimiento } from '../../domain/producto-requerimiento';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private url = environment.apiUrlM1 + "productos/";

  constructor(private http: HttpClient) { }

  guardarProducto(productoGuarda: ProductoRequerimiento): Observable<string>{
    return this.http.post<string>(this.url+'guardar', productoGuarda);
  }
}
