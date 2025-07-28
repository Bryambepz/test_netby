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

        [HttpGet("obtenerTiposTransaccion")]
        public IActionResult obtenerTipoTransaccion()
        {
            List<TipoTransaccion> tipoTrans = db.TipoTransaccion.ToList();
            return Ok(tipoTrans);
        }

        [HttpPost("guardar")]
        public IActionResult guardar(Transacciones transaccionGuardar)
        {
            return Ok();
        }
    }
}
