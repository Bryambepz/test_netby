# test_netby
Prueba de microservicios

## Instrucciones
### Script para generar las tablas
sqlcmd -S localhost -U sa -P zoaOj4a4iqP$opM#5Ka -i C:\Users\braya\OneDrive\Documentos\TRABAJOS\PRUEBA_NETBY\Script.sql

### Para realizar ingenieria inversa, crear los modelos apartir de las tablas creadas
- Revisar que se tenga dotnet ef instalado, ejecutar el comando:
	- Revisar
	`dotnet ef --version`
	- Instalar
	`dotnet tool install --global dotnet-ef`
- Antes de realizar el mapeo con scaffold, instalar el paquete design
	`dotnet add package Microsoft.EntityFrameworkCore.Design`
- Instalar el proveedor de EF Core para poder usar SQL Server
	`dotnet add package Microsoft.EntityFrameworkCore.SqlServer`
- Finalmente para mapear las entidades emplear estos comandos
	`dotnet ef dbcontext scaffold "Name=DefaultConnection" Microsoft.EntityFrameworkCore.SqlServer --schema PRODUCTO --schema SUJETO --schema TRANSACCION --output-dir Entidades --context-dir BaseDatos --context BaseDatosContext --project Core/Core.csproj --startup-project ProductosAPI/ProductosAPI.csproj --force --no-pluralize --no-onconfiguring`