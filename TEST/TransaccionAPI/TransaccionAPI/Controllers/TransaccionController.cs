using Core.BaseDatos;
using Core.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace TransaccionAPI.Controllers
{
    [ApiController]
    [Route("api2/transaccion")]
    public class TransaccionController : ControllerBase
    {
        private readonly BaseDatosContext db;

        public TransaccionController(BaseDatosContext _db)
        {
            db = _db;
        }

        [HttpGet("test")]
        public IActionResult getTest()
        {
            return Ok("API OK");
        }

        [HttpGet("getTiposTransaccion")]
        public IActionResult obtenerTipoTransaccion()
        {
            List<TipoTransaccion> tipoTrans = db.TipoTransaccion.ToList();
            return Ok(tipoTrans);
        }

        [HttpPost("guardar")]
        public IActionResult guardar(Transacciones transaccionGuardar)
        {
            if (transaccionGuardar == null)
            {
                return BadRequest("No hay datos que guardar de la transacción");
            }
            else
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        Productos productoTransaccion = db.Productos.Where( p => p.Id == transaccionGuardar.Producto.Id ).FirstOrDefault();
                        if ( transaccionGuardar.Cantidad > productoTransaccion.Stock )
                        {
                            return BadRequest($"No se tiene la cantidad de {transaccionGuardar.Cantidad} en stock del producto {productoTransaccion.Nombre}\n Indique un valor menor o igual a {productoTransaccion.Stock}");
                        }
                        productoTransaccion.Stock -= transaccionGuardar.Cantidad;
                        transaccionGuardar.ProductoId = transaccionGuardar.Producto.Id;
                        transaccionGuardar.Producto = null;
                        transaccionGuardar.TipoTransaccionId = transaccionGuardar.TipoTransaccion.Id;
                        transaccionGuardar.TipoTransaccion = null;
                        db.Add(transaccionGuardar);
                        db.Update(productoTransaccion);
                        db.SaveChanges();
                        transaction.Commit();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new Exception("Error al guardar la transaccion");
                    }
                }
            }
            return Ok("Transaccion Guardada");
        }
    }
}
