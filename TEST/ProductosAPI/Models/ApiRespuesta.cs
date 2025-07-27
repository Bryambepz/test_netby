namespace Models
{
    public class ApiRespuesta<T>
    {
        public bool HayError { get; set; }
        public ErrorRespuesta Error { get; set; }
        public T Body { get; set; }
    }

    public class ErrorRespuesta
    {
        public string MensajeError { get; set; }
        public Exception Exception { get; set; }
        public int CodigoRespuesta { get; set; }
    }
}
