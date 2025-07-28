import { Producto } from "./producto";

export interface Transaccion{
    id: number;
    fecha: Date;
    cantidad: number;
    precioUnitario: number;
    precioTotal: number;
    detalle: string;
    estado: boolean;
    producto: Producto;
    tipoTransaccion: Transaccion;
}