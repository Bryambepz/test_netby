import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ApiRespuesta } from '../domain/apiRespuesta';
import Swal from 'sweetalert2';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        console.log('el body', event.body);
        
        const respuesta = event.body as ApiRespuesta<any>;

        if (respuesta && typeof respuesta.hayError === 'boolean') {
          if (respuesta.hayError) {
            const mensaje =
              respuesta.error?.mensajeError ?? 'Ocurrió un error desconocido.';
            Swal.fire({
              title: 'Error',
              text: mensaje,
              icon: 'error',
            });
            throw new Error(mensaje);
          }

          return event.clone({
            body: respuesta.body,
          });
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
      return throwError(() => error);
    })
  );
};
