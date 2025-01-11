import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function ListHumanResults(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `{"message":"There are 24 results: Interception, Poop"}` };
};

app.http('ListHumanResults', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: ListHumanResults
});
