using Core.BaseDatos;
using Core.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace ProductosAPI.Controllers
{
    [ApiController]
    [Route("api/productos")]
    public class ProductoController: ControllerBase
    {
        private readonly BaseDatosContext db;

        public ProductoController(BaseDatosContext _db)
        {
            db = _db;
        }

        [HttpGet("test")]
        public IActionResult getTest()
        {
            return Ok("API OK");
        }

        [HttpGet("getProductos")]
        public IActionResult getProduct([FromQuery] int pagina, [FromQuery] int paginaTamanio)
        {
            List<Productos> productos = db.Productos.OrderBy(o => o.Id).Skip( (pagina - 1) * paginaTamanio ).Take(paginaTamanio).ToList();
            return Ok(productos);
        }
    }
}
