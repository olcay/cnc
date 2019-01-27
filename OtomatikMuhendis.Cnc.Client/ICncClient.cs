using System.Threading.Tasks;

namespace OtomatikMuhendis.Cnc.Client
{
    public interface ICncClient
    {
        Task UnlockMotors();

        Task PenDown();

        Task PenUp();

        Task GoTo(int x, int y);
    }
}