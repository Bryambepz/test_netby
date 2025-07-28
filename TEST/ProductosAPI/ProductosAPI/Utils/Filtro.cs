using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Models;

namespace ProductosAPI.Utils
{
    public class Filtro : IActionFilter, IExceptionFilter
    {
        private readonly ILogger<Filtro> _logger;

        public Filtro(ILogger<Filtro> logger)
        {
            _logger = logger;
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Result is ObjectResult objectResult)
            {
                var codigoEstado = objectResult.StatusCode ?? 500;

                var response = new ApiRespuesta<object>
                {
                    HayError = codigoEstado == 200 ? false : true,
                    Body = codigoEstado == 200 ? objectResult.Value : null,
                    Error = codigoEstado != 200 ? new ErrorRespuesta
                    {
                        CodigoRespuesta = codigoEstado,
                        MensajeError = objectResult.Value?.ToString() ?? "Error no Administrado",
                    } : null,
                };

                context.Result = new ObjectResult(response)
                {
                    StatusCode = objectResult.StatusCode
                };
            }
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {

        }

        public void OnException(ExceptionContext context)
        {
            var error = new ApiRespuesta<object>
            {
                HayError = true,
                Body = null,
                Error = new ErrorRespuesta
                {
                    MensajeError = context.Exception.Message,
                    Exception = context.Exception.StackTrace,
                    CodigoRespuesta = 500
                }
            };

            _logger.LogError(context.Exception, context.Exception.Message);

            context.Result = new ObjectResult(error)
            {
                StatusCode = 500
            };

            context.ExceptionHandled = true;
        }
    }
}
