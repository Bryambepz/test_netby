import { Transaccion } from "./transaccion";

export interface TransaccionRespuesta {
  transaccionesLista: Transaccion[];
  totalTransacciones: number;
}
