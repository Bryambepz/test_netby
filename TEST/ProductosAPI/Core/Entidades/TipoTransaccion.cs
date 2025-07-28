using System;
using System.Collections.Generic;

namespace Core.Entidades;

public partial class TipoTransaccion
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public bool Estado { get; set; }

    public virtual ICollection<Transacciones> Transacciones { get; set; } = new List<Transacciones>();
}
