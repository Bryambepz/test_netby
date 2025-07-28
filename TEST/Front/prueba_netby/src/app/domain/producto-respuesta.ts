import { Producto } from "./producto";

export interface ProductoRespuesta {
    productosLista: Producto[];
    totalProductos: number;
}