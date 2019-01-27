using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace OtomatikMuhendis.Cnc.Client
{
    public class CncClient : ICncClient
    {
        private readonly HttpClient _client;

        public CncClient(HttpClient httpClient)
        {
            httpClient.BaseAddress = new Uri("http://localhost:4242/");
            _client = httpClient;
        }

        public async Task UnlockMotors()
        {
            await _client.DeleteAsync("/v1/motors");
        }

        public async Task PenDown()
        {
            await _client.GetAsync("/pen.down");
        }

        public async Task PenUp()
        {
            await _client.GetAsync("/pen.up");
        }

        public async Task GoTo(int x, int y)
        {
            await _client.GetAsync($"/coord/{x}/{y}");
        }
    }
}
