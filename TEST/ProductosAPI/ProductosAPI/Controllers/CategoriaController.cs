using Core.BaseDatos;
using Core.Entidades;
using Microsoft.AspNetCore.Mvc;
using Models.CategoriaModel;

namespace ProductosAPI.Controllers
{
    [ApiController]
    [Route("api/Categoria")]
    public class CategoriaController: ControllerBase
    {
        private readonly BaseDatosContext db;
        public CategoriaController(BaseDatosContext _db)
        {
            db = _db;
        }

        [HttpPost("guardar")]
        public IActionResult guardar(Categoria categoria)
        {
            if ( categoria == null )
            {
                throw new Exception("La categoria esta vacia");
            } else
            {
                db.Categoria.Add(categoria);
                db.SaveChanges();
            }
            return Ok("Categoria Guardada");
        }

        [HttpGet("getCategorias")]
        public IActionResult getCategorias([FromQuery] int pagina, [FromQuery] int paginaTamanio)
        {
            int totalRegistros = db.Categoria.ToList().Count();
            List<Categoria> categorias = db.Categoria.OrderBy(o => o.Id).Skip((pagina - 1) * paginaTamanio).Take(paginaTamanio).ToList();
            var respuesta = new RespuestaCategorias
            {
                 TotalCategorias = totalRegistros,
                 Categorias = categorias
            };
            return Ok(respuesta);
        }

        [HttpGet("getCategoriasAll")]
        public IActionResult getCategoriasAll()
        {
            //int totalRegistros = db.Categoria.ToList().Count();
            List<Categoria> categorias = db.Categoria.OrderBy(o => o.Id).ToList();
            //var respuesta = new RespuestaCategorias
            //{
            //    TotalCategorias = totalRegistros,
            //    Categorias = categorias
            //};
            return Ok(categorias);
        }
    }
}
