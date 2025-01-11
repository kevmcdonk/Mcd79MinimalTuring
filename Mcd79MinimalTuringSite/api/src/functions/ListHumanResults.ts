import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.HumanWordsStorageConnectionAppSetting;
if (!connectionString) {
    throw new Error("HumanWordsStorageConnectionAppSetting is not defined");
}
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerName = "humanwords";

export async function ListHumanResults(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobs = containerClient.listBlobsFlat();
    const results = [];

    for await (const blob of blobs) {
        const blobClient = containerClient.getBlobClient(blob.name);
        const downloadBlockBlobResponse = await blobClient.download();
        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error("Readable stream body is undefined");
        }
        const downloaded = await streamToString(downloadBlockBlobResponse.readableStreamBody);
        results.push(JSON.parse(downloaded));
    }

    return { body: JSON.stringify(results) };
};

async function streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}

app.http('ListHumanResults', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: ListHumanResults
});
