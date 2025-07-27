export interface ApiRespuesta<T> {
    hayError: boolean;
    error?: ErrorRespuesta;
    body: T;
}

export interface ErrorRespuesta {
    mensajeError: string;
    codigoRespuesta: number;
    excepcion: any;
}