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
    public class SubmitWord
    {
        private readonly ILogger<SubmitWord> _logger;
        

        public SubmitWord(ILogger<SubmitWord> logger)
        {
            _logger = logger;
        }

        [Function("SubmitWord")]
        [BlobOutput("humanwords/result-{DateTime:yyyyMMdd-hhmmss}.json", Connection = "HumanWordsStorageConnectionAppSetting")]
        public async Task<string> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
            [TextCompletionInput(
                "You are an experiment where you must convince a human judge that you are human. You are competing against a human. Each of you will select a single word to prove you are the human. What single word would you choose? Just return the single word and no other information.", 
                Model = "mcd79is4o"
            )] TextCompletionResponse response
        )
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            
            string requestBody;

            using (var streamReader = new StreamReader(req.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            _logger.LogInformation("Human Word sent: " + requestBody);
            string message = requestBody;
            var jsonContent = JsonConvert.DeserializeObject<ExperimentResult>(requestBody);
            _logger.LogInformation($"Blob JSON content: {jsonContent}");
                    
            jsonContent.AIWord = response.Content;
            
            return JsonConvert.SerializeObject(jsonContent);
        }
    }
}
