import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";

/*
    This function will capture the word posted and store it as a json file in the storage account.
*/

const currentTime = new Date().toISOString();
    const blobName = `humanwords/${currentTime}-humanword.txt`;

export async function SubmitWord(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';
    context.log(` "${name}"`);
    

    const output = {
        name: 'outputBlob',
        type: 'blob',
        path: blobName,
        connection: 'HumanWordsStorageConnectionAppSetting',
    }

    context.extraOutputs.set(output, `{"message":"Added word - thanks!"}`);
    context.log(`Has it written?`);
    return { body: `{"message":"Added word - thanks!"}` };
};

app.http('SubmitWord', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: SubmitWord,
    extraOutputs: [{
        name: 'outputBlob',
        type: 'blob',
        path: blobName,
        connection: 'HumanWordsStorageConnectionAppSetting',
    }]
});
