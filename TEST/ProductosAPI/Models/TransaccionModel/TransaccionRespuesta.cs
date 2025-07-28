using Core.Entidades;

namespace Models.TransaccionModel
{
    public class TransaccionRespuesta
    {
        public List<Transacciones> TransaccionesLista { get; set; }
        public int TotalTransacciones { get; set; }
    }
}
