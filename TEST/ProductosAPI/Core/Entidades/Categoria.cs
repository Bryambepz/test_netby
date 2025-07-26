using System;
using System.Collections.Generic;

namespace Core.Entidades;

public partial class Categoria
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public bool Estado { get; set; }

    public virtual ICollection<Productos> Productos { get; set; } = new List<Productos>();
}
