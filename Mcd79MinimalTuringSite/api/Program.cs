using Microsoft.Azure.Functions.Worker.Builder;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();
builder.Services.AddSingleton(x =>
            {
                string connectionString = Environment.GetEnvironmentVariable("HumanWordsStorageConnectionAppSetting") 
                                           ?? throw new InvalidOperationException("HumanWordsStorageConnectionAppSetting environment variable is not set.");
                return new BlobServiceClient(connectionString);
            });



// Application Insights isn't enabled by default. See https://aka.ms/AAt8mw4.
// builder.Services
//     .AddApplicationInsightsTelemetryWorkerService()
//     .ConfigureFunctionsApplicationInsights();

builder.Build().Run();
