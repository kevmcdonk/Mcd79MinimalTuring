using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Mcd79.MinimalTuring.Functions
{
    public class SubmitWord
    {
        private readonly ILogger<SubmitWord> _logger;

        public SubmitWord(ILogger<SubmitWord> logger)
        {
            _logger = logger;
        }

        [Function("SubmitWord")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
            return new OkObjectResult("{\"Message\":\"Welcome to Azure Functions!\"}");
        }
    }
}
