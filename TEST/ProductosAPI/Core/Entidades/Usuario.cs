using System;
using System.Collections.Generic;

namespace Core.Entidades;

public partial class Usuario
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string Usuario1 { get; set; } = null!;

    public string Clave { get; set; } = null!;

    public int RolId { get; set; }

    public bool Estado { get; set; }

    public virtual Rol Rol { get; set; } = null!;

    public virtual ICollection<Transacciones> Transacciones { get; set; } = new List<Transacciones>();
}
