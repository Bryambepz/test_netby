using Core.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.ProductoModel
{
    public  class ProductoRequerimiento
    {
        public Productos productos {  get; set; }
        public string imagenNombre { get; set; }
    }
}
