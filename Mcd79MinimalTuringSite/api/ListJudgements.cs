using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;
using Mcd79.MinimalTuring.Model;


namespace Mcd79.MinimalTuring.Functions
{
    public class ListJudgements
    {
        private readonly ILogger<ListJudgements> _logger;
        private readonly BlobServiceClient _blobServiceClient;

        public ListJudgements(ILogger<ListJudgements> logger, BlobServiceClient blobServiceClient)
        {
            _logger = logger;
            _blobServiceClient = blobServiceClient;
        }

        [Function("ListWListJudgementsords")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ListJudgements")] HttpRequest req
        )
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            var containerClient = _blobServiceClient.GetBlobContainerClient("guesses");
            var blobs = containerClient.GetBlobs();

            List<Judgement> blobContents = new List<Judgement>();

            var blobNames = blobs
                .OrderByDescending(blob => blob.Properties.CreatedOn)
                .Select(blob => blob.Name)
                .ToList();
            foreach(var blob in blobs)
            {
                var blobClient = containerClient.GetBlobClient(blob.Name);
                var downloadInfo = await blobClient.DownloadAsync();

                using (var reader = new StreamReader(downloadInfo.Value.Content))
                {
                    string content = await reader.ReadToEndAsync();
                    _logger.LogInformation($"Blob content: {content}");
                    var jsonContent = JsonConvert.DeserializeObject<Judgement>(content);
                    _logger.LogInformation($"Blob JSON content: {jsonContent}");
                    if (jsonContent != null)
                    {
                        blobContents.Add(jsonContent);
                    }
                }
                _logger.LogInformation($"Blob name: {blob.Name}, Created On: {blob.Properties.CreatedOn}");
            }

            return new OkObjectResult(blobContents);
        }
    }
}
