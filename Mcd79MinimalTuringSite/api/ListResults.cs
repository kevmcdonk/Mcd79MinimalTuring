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
    public class ListResults
    {
        private readonly ILogger<ListResults> _logger;
        private readonly BlobServiceClient _blobServiceClient;

        public ListResults(ILogger<ListResults> logger, BlobServiceClient blobServiceClient)
        {
            _logger = logger;
            _blobServiceClient = blobServiceClient;
        }

        [Function("ListResults")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ListResults")] HttpRequest req
        )
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            var containerClient = _blobServiceClient.GetBlobContainerClient("humanwords");
            var blobs = containerClient.GetBlobs();

            List<ExperimentResult> blobContents = new List<ExperimentResult>();

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
                    var jsonContent = JsonConvert.DeserializeObject<ExperimentResult>(content);
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
