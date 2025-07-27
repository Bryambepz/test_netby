using System;
using System.Collections.Generic;

namespace Core.Entidades;

public partial class Productos
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string Descripcion { get; set; } = null!;

    public string Imagen { get; set; } = null!;

    public decimal Precio { get; set; }

    public int Stock { get; set; }

    public int CategoriaId { get; set; }

    public virtual Categoria Categoria { get; set; } = null!;

    public virtual ICollection<Transacciones> Transacciones { get; set; } = new List<Transacciones>();
}
