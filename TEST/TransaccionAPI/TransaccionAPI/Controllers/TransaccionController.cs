using Core.BaseDatos;
using Core.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.ProductoModel;
using Models.TransaccionModel;

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

        [HttpPost("actualizar")]
        public IActionResult actualizar(Transacciones transaccionGuardar)
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
                        Productos productoTransaccion = db.Productos.Where(p => p.Id == transaccionGuardar.Producto.Id).FirstOrDefault();
                        Transacciones transaccionGuardada = db.Transacciones.Where(p => p.Id == transaccionGuardar.Id).FirstOrDefault();
                        if (transaccionGuardar.Cantidad > productoTransaccion.Stock)
                        {
                            return BadRequest($"No se tiene la cantidad de {transaccionGuardar.Cantidad} en stock del producto {productoTransaccion.Nombre}\n Indique un valor menor o igual a {productoTransaccion.Stock}");
                        }
                        if ( transaccionGuardar.Cantidad > transaccionGuardada.Cantidad )
                        {
                            var diferencia = transaccionGuardar.Cantidad - transaccionGuardada.Cantidad;
                            productoTransaccion.Stock -= diferencia;
                        } else if (transaccionGuardar.Cantidad < transaccionGuardada.Cantidad)
                        {
                            var diferencia = transaccionGuardar.Cantidad - transaccionGuardada.Cantidad;
                            productoTransaccion.Stock += diferencia;
                        }
                        transaccionGuardar.ProductoId = transaccionGuardar.Producto.Id;
                        transaccionGuardar.Producto = null;
                        transaccionGuardar.TipoTransaccionId = transaccionGuardar.TipoTransaccion.Id;
                        transaccionGuardar.TipoTransaccion = null;
                        db.Update(transaccionGuardar);
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
            return Ok("Transaccion Actualizada");
        }

        [HttpGet("getTransaccionesPaginacion")]
        public IActionResult getTransaccionesPaginacion([FromQuery] int pagina, [FromQuery] int paginaTamanio)
        {
            int totalRegistros = db.Transacciones.ToList().Count();
            List<Transacciones> transaccionesList = db.Transacciones
                .Include(i => i.Producto)
                .Include(i => i.TipoTransaccion)
                .Where(p => p.Estado)
                .OrderBy(o => o.Id)
                .Skip((pagina - 1) * paginaTamanio)
                .Take(paginaTamanio)
                .Select(s => new Transacciones
                {
                    Id = s.Id,
                    Fecha = s.Fecha,
                    Cantidad = s.Cantidad,
                    PrecioUnitario = s.PrecioUnitario,
                    PrecioTotal = s.PrecioTotal,
                    Detalle = s.Detalle,
                    Estado = s.Estado,
                    TipoTransaccion = new TipoTransaccion
                    {
                        Id = s.TipoTransaccion.Id,
                        Nombre = s.TipoTransaccion.Nombre,
                    },
                    Producto = new Productos
                    {
                        Id = s.Producto.Id,
                        Nombre = s.Producto.Nombre
                    }
                })
                .ToList();
            var respuesta = new TransaccionRespuesta
            {
                TotalTransacciones = totalRegistros,
                TransaccionesLista = transaccionesList,
            };
            return Ok(respuesta);
        }

        [HttpGet("getTransaccionById/{id}")]
        public IActionResult getTransaccionById([FromRoute] int id)
        {
            var pathImg = Directory.GetParent(Directory.GetCurrentDirectory())!.FullName.Replace("TransaccionAPI", "NAS-IMGS\\");
            Transacciones transaccionesPorId = db.Transacciones
               .Include(i => i.Producto)
               .Include(i => i.TipoTransaccion)
               .Where(p => p.Estado && p.Id == id)
               .Select(s => new Transacciones
               {
                   Id = s.Id,
                   Fecha = s.Fecha,
                   Cantidad = s.Cantidad,
                   PrecioUnitario = s.PrecioUnitario,
                   PrecioTotal = s.PrecioTotal,
                   Detalle = s.Detalle,
                   Estado = s.Estado,
                   TipoTransaccion = new TipoTransaccion
                   {
                       Id = s.TipoTransaccion.Id,
                       Nombre = s.TipoTransaccion.Nombre,
                       Estado = s.Estado,
                       Transacciones = new List<Transacciones>()
                   },
                   Producto = new Productos
                   {
                       Id = s.Producto.Id,
                       Nombre = s.Producto.Nombre,
                       Estado = s.Producto.Estado,
                       Descripcion = s.Producto.Descripcion,
                       Imagen = s.Producto.Imagen.Replace(pathImg, ""),
                       Precio = s.Producto.Precio,
                       Stock = s.Producto.Stock,
                       Categoria = new Categoria
                       {
                           Id = s.Producto.Categoria.Id,
                           Nombre = s.Producto.Categoria.Nombre,
                           Productos = null,
                       }
                   }
               })
               .FirstOrDefault();

            return Ok(transaccionesPorId);
        }

        [HttpGet("eliminarTransaccion/{id}")]
        public IActionResult eliminarTransaccion([FromRoute] int id)
        {
            Transacciones transaccionEliminar = db.Transacciones.Where(p => p.Estado && p.Id == id).FirstOrDefault();
            if (transaccionEliminar == null)
            {
                return BadRequest("No se encontro la transaccion a eliminar");
            }
            transaccionEliminar.Estado = false;
            db.Update(transaccionEliminar);
            db.SaveChanges();
            return Ok("Transaccion Eliminada");
        }
    }
}
