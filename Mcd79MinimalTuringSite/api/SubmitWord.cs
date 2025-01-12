using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;


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
        [BlobOutput("humanwords/result-{DateTime:yyyyMMdd-hhmmss}.txt", Connection = "AzureWebJobsStorage")]
        public async Task<string> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req
        )
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            
            string requestBody;
            using (var streamReader = new StreamReader(req.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }

            string message = requestBody;
            if (!requestBody.StartsWith("{\"message\":"))
            {
                message = "{\"message\":\"" + requestBody + "\"}";
            }
            
            return message;
        }
    }
}
