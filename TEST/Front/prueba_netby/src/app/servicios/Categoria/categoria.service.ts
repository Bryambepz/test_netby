import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Categoria } from '../../domain/categoria';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RespuestaCategoria } from '../../domain/respuesta-categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url = environment.apiUrlM1 + "Categoria/";
  
  constructor(private http: HttpClient) { }

  guardarCategoria(categoriaGuarda: Categoria): Observable<string>{
    return this.http.post<string>(this.url+'guardar', categoriaGuarda);
  }

  obtenerCategorias(pagina: number, tamanio: number): Observable<RespuestaCategoria>{
    return this.http.get<RespuestaCategoria>(this.url+`getCategorias?pagina=${pagina}&paginaTamanio=${tamanio}`);
  }

}
