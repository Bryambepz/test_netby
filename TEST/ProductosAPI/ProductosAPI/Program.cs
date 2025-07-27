using Core.BaseDatos;
using Microsoft.EntityFrameworkCore;
using ProductosAPI.Utils;

var builder = WebApplication.CreateBuilder(args);

//Agrega conexion de BaseDatos
builder.Services.AddDbContext<BaseDatosContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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
