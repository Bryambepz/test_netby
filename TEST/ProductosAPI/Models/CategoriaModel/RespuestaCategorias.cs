using Core.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.CategoriaModel
{
    public class RespuestaCategorias
    {
        public List<Categoria> Categorias {  get; set; }
        public int TotalCategorias {  get; set; }
    }
}
