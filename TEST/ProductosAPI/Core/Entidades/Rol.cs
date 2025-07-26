using System;
using System.Collections.Generic;

namespace Core.Entidades;

public partial class Rol
{
    public int Id { get; set; }

    public bool Estado { get; set; }

    public virtual ICollection<Usuario> Usuario { get; set; } = new List<Usuario>();
}
