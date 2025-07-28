import { Categoria } from "./categoria";

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    imagen?: string;
    precio: number;
    stock: number;
    categoria: Categoria;
    estado: boolean;
}