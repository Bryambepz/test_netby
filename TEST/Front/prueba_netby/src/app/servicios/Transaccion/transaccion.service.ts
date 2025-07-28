import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoTransaccion } from '../../domain/tipo-transaccion';
import { Transaccion } from '../../domain/transaccion';

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
}
