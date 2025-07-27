using System;
using System.Collections.Generic;

namespace Core.Entidades;

public partial class Transacciones
{
    public int Id { get; set; }

    public DateOnly Fecha { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal PrecioTotal { get; set; }

    public string Detalle { get; set; } = null!;

    public int TipoTransaccionId { get; set; }

    public int ProductoId { get; set; }

    public virtual Productos Producto { get; set; } = null!;

    public virtual TipoTransaccion TipoTransaccion { get; set; } = null!;
}
