# Prueba técnica Netby
Realizar una aplicación distribuida con APIRest y Angular (Es la opción que seleccione para esta prueba)

## Instrucciones
### Script para generar las tablas
> **Nota:** Asegúrate de que el archivo `Script.sql` esté ubicado en la carpeta donde se descargó el repositorio.  
> Por ejemplo:  
> `C:\Users\braya\OneDrive\Documentos\TRABAJOS\PRUEBA_NETBY`
```bash
sqlcmd -S localhost -U sa -P zoaOj4a4iqP$opM#5Ka -i C:\Users\braya\OneDrive\Documentos\TRABAJOS\PRUEBA_NETBY\Script.sql
```
### Para realizar ingenieria inversa, crear los modelos apartir de las tablas creadas
> **Nota:** ESto es solo si va se va a replicar paso a paso la creación del proyecto
- Revisar que se tenga dotnet ef instalado, ejecutar el comando:
	- Revisar
	```bash
	dotnet ef --version`
 	```
	- Instalar
	```bash
	dotnet tool install --global dotnet-ef
 	```
- Antes de realizar el mapeo con scaffold, instalar el paquete design
```bash
dotnet add package Microsoft.EntityFrameworkCore.Design
```
- Instalar el proveedor de EF Core para poder usar SQL Server
```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```
- Finalmente para mapear las entidades emplear estos comandos
```bash
dotnet ef dbcontext scaffold "Name=DefaultConnection" Microsoft.EntityFrameworkCore.SqlServer --schema PRODUCTO --schema SUJETO --schema TRANSACCION --output-dir Entidades --context-dir BaseDatos --context BaseDatosContext --project Core/Core.csproj --startup-project ProductosAPI/ProductosAPI.csproj --force --no-pluralize --force
```

### Con el script ejecutado, la base de datos ya es funcional y lista para ser utilizada. Se crearon dos proyectos APIRest, el cual cada uno tiene su propia documentación con SWAGGER.
- Para ejecutar cada proyecto se debe estar en una carpeta que no requiera de permisos de Administrador y que tenga permisos de escritura y lectura
- El IDE empleado para los servicios fue Visual Studio 2022, emplear el mismo para no tener compliaciones.
- La base de datos es SQL Server Express
- Se empleo .NMET Core 8 que es de las ultimas versiones y es estable

### Para el frontEnd se recomienda emplear el IDE vscode
- Si ya se encuentra abierto el IDE o solo desean ejecutar desde fuera, es necesario ubicarse en la carpeta del proyecto que es PRUEBA_NETBY como se creo y publicó en GITHUB en este repositorio
- Para ejecutar el front y tener acceso a la aplicación ejecute este comando
  ```bash
  ng server --open
  ```
- Lo mas probable es que no puedan ejecutar por falta de una carpeta que contiene las librerias, asi que ejeucten
  ```bash
  npm install
  ```
- El proyecto funciona en Angular 17, asi que tener instalado:
	- Angular 17
 	- Node 18
  
