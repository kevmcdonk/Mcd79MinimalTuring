import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function SubmitWord(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';
    context.log(` "${name}"`);
    return { body: `{"message":"Hello, bob!"}` };
};

app.http('SubmitWord', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: SubmitWord
});
