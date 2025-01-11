import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";

/*
    This function will capture the word posted and store it as a json file in the storage account.
*/

export async function SubmitWord(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';
    context.log(` "${name}"`);
    return { body: `{"message":"Hello, bob!"}` };
};

app.http('SubmitWord', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: SubmitWord,
    extraOutputs: [{
        name: 'outputBlob',
        type: 'blob',
        path: 'humanwords/{queueTrigger}-${Date.now()}-humanword.txt',
        connection: 'HumanWordsStorageConnectionAppSetting',
    }]
});
