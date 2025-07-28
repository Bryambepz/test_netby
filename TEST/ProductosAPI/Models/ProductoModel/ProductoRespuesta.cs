using Core.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.ProductoModel
{
    public class ProductoRespuesta
    {
        public List<Productos> ProductosLista {  get; set; }
        public int TotalProductos { get; set; }
    }
}
