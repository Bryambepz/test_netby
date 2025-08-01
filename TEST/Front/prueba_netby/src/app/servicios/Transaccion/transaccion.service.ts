import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoTransaccion } from '../../domain/tipo-transaccion';
import { Transaccion } from '../../domain/transaccion';
import { TransaccionRespuesta } from '../../domain/transaccion-respuesta';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private url = environment.apiUrlM2 + "transaccion/";

  constructor(private http: HttpClient) { }

  obtenerTiposTransaccion(): Observable<TipoTransaccion[]>{
    return this.http.get<TipoTransaccion[]>(this.url+`getTiposTransaccion`);
  }

  guardarTransaccion(transaccionGuarda: Transaccion):Observable<string> {
    return this.http.post<string>(this.url+'guardar', transaccionGuarda);
  }

  actualizarTransaccion(transaccionGuarda: Transaccion): Observable<string>{
    return this.http.post<string>(this.url+'actualizar', transaccionGuarda);
  }

  obtenerTransaccionPaginacion(pagina: number, tamanio: number): Observable<TransaccionRespuesta>{
    return this.http.get<TransaccionRespuesta>(this.url+`getTransaccionesPaginacion?pagina=${pagina}&paginaTamanio=${tamanio}`);
  }

  obtenerTransaccionPorId(id: number): Observable<Transaccion>{
    return this.http.get<Transaccion>(this.url+`getTransaccionById/${id}`);
  }
  
  eliminarTransaccion(id: number): Observable<string>{
    return this.http.get<string>(this.url+`eliminarTransaccion/${id}`);
  }
}
