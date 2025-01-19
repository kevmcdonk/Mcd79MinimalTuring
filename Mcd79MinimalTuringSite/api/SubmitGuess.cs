using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Azure.Functions.Worker.Extensions.OpenAI.TextCompletion;
using Newtonsoft.Json;
using Mcd79.MinimalTuring.Model;

namespace Mcd79.MinimalTuring.Functions
{
    public class SubmitGuess
    {
        private readonly ILogger<SubmitWord> _logger;
        

        public SubmitGuess(ILogger<SubmitWord> logger)
        {
            _logger = logger;
        }

        [Function("SubmitGuess")]
        [BlobOutput("guesses/result-{DateTime:yyyyMMdd-hhmmss}.json", Connection = "HumanWordsStorageConnectionAppSetting")]
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
            
            return requestBody;
        }
    }
}
