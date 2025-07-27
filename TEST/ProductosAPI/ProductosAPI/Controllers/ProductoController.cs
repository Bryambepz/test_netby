using Core.BaseDatos;
using Core.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.ProductoModel;

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

        [HttpPost("guardar")]
        public IActionResult guardarAsync(ProductoRequerimiento productoRequerimiento)
        {
            if (productoRequerimiento.productos == null)
            {
                throw new Exception("El producto esta vacio");
            }
            else
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        if (string.IsNullOrWhiteSpace(productoRequerimiento.imagenNombre))
                            return BadRequest("Nombre de archivo vacío.");

                        var rutaPAth = Directory.GetParent(Directory.GetCurrentDirectory())!.FullName;
                        rutaPAth = rutaPAth.Replace("ProductosAPI", "NAS-IMGS");
                        var rutaTemp = Path.Combine(rutaPAth.Replace("NAS-IMGS", "TEMP"), productoRequerimiento.imagenNombre);

                        if (!System.IO.File.Exists(rutaTemp))
                            return NotFound("La imagen del producto no ha sido cargada.");

                        //db.Categoria.Add(productoRequerimiento.productos.Categoria);
                        //db.SaveChanges();

                        productoRequerimiento.productos.CategoriaId = productoRequerimiento.productos.Categoria.Id;
                        productoRequerimiento.productos.Categoria = null;
                        db.Productos.Add(productoRequerimiento.productos);
                        db.SaveChanges();

                        int idProductoGuardado = productoRequerimiento.productos.Id;
                        var rutaImagenGuardar = Path.Combine(rutaPAth, $"{idProductoGuardado}.png");
                        Directory.CreateDirectory(Path.GetDirectoryName(rutaImagenGuardar));

                        System.IO.File.Copy(rutaTemp, rutaImagenGuardar, overwrite: true);
                        System.IO.File.Delete(rutaTemp);

                        productoRequerimiento.productos.Imagen = rutaImagenGuardar;
                        db.Productos.Update(productoRequerimiento.productos);
                        db.SaveChanges();

                        transaction.Commit();
                    } catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new Exception("Error al guardar el producto");
                    }
                }
            }
            return Ok("Producto Guardado");
        }

        [HttpGet("getProductos")]
        public IActionResult getProduct([FromQuery] int pagina, [FromQuery] int paginaTamanio)
        {
            List<Productos> productos = db.Productos.OrderBy(o => o.Id).Skip( (pagina - 1) * paginaTamanio ).Take(paginaTamanio).ToList();
            return Ok(productos);
        }

        [HttpPost("cargarImagen")]
        public async Task<IActionResult> cargarImagen(IFormFile imagen)
        {
            if (imagen == null || imagen.Length == 0)
                throw new Exception("No fue seleccionada una imagen");

            var rutaPAth = Directory.GetParent(Directory.GetCurrentDirectory())!.FullName;
            //rutaPAth = rutaPAth.Replace("ProductosAPI", "NAS-IMGS");
            rutaPAth = rutaPAth.Replace("ProductosAPI", "TEMP");
            var carpetaNAS = rutaPAth;
            Directory.CreateDirectory(carpetaNAS);
            var fileName = Guid.NewGuid() + Path.GetExtension(imagen.FileName);
            var filePath = Path.Combine(carpetaNAS, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await imagen.CopyToAsync(stream);

            // Puedes retornar solo el nombre o la ruta si luego la sirves
            return Ok(new { imageUrl = fileName });
        }
    }
}
