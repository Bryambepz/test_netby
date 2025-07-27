namespace ProductosAPI.Utils
{
    public class MiddlewareAcceso
    {
        private readonly ILogger _logger;
        private readonly RequestDelegate _next;

        public MiddlewareAcceso(RequestDelegate next, ILogger<MiddlewareAcceso> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            _logger.LogInformation($"Peticion Entrante => {context.Request.Method} {context.Request.Path}");

            await _next(context);

            _logger.LogInformation($"Respuest=> {context.Response.StatusCode}");
        }
    }
}
