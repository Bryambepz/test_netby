using Core.BaseDatos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using ProductosAPI.Utils;

var builder = WebApplication.CreateBuilder(args);

//Agrega conexion de BaseDatos
builder.Services.AddDbContext<BaseDatosContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHostedService<BorrarTemporales>();

// Agrgar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

// Add services to the container.
builder.Services.AddControllers(options =>
{
    // Se ajkecuta siempre cada que ingresa una peticion
    options.Filters.Add<Filtro>();
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

var rutaImagenes = Directory.GetParent(Directory.GetCurrentDirectory())!.FullName;
rutaImagenes = rutaImagenes.Replace("ProductosAPI", "NAS-IMGS");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(rutaImagenes),
    RequestPath = "api/imagenes"
});

app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();

app.UseMiddleware<MiddlewareAcceso>();

app.UseAuthorization();

app.MapControllers();

app.Run();
