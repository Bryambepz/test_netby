
namespace ProductosAPI.Utils
{
    public class BorrarTemporales : BackgroundService
    {
        private readonly string _carpetaTemporal;
        private readonly ILogger<BorrarTemporales> _logger;

        public BorrarTemporales(ILogger<BorrarTemporales> logger)
        {
            var rutaPAth = Directory.GetParent(Directory.GetCurrentDirectory())!.FullName;
            rutaPAth = rutaPAth.Replace("ProductosAPI", "TEMP");
            _carpetaTemporal = Path.Combine(rutaPAth);
            _logger = logger;

        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (stoppingToken.IsCancellationRequested)
            {
                try
                {
                    if (Directory.Exists(_carpetaTemporal))
                    {
                        var archivos = Directory.GetFiles(_carpetaTemporal);
                        foreach (var archivo in archivos)
                        {
                            var infoArchivo = new FileInfo(archivo);
                            if ( infoArchivo.LastWriteTime < DateTime.Now.AddMinutes(-1) )
                            {
                                infoArchivo.Delete();
                                _logger.LogInformation($"Eliminado archivo temporal: {infoArchivo.Name}");
                            }
                        }
                    }
                } catch (Exception ex)
                {
                    _logger.LogError(ex, "Error durante limpieza de archivos temporales");
                }

                await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken); // revisa cada 10 minutos
            }
        }
    }
}
