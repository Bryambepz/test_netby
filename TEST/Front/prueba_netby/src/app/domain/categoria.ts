import { Producto } from "./producto";

export interface Categoria {
    id: number;
    nombre: string;
    estado: boolean;
    productos?: Producto[];
}