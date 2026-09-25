const http = require('http');
const Koa = require('koa');
const {koaBody} = require('koa-body');
const koaStatic = require('koa-static');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const WS = require('ws');

const app = new Koa();
const router = require('./routes');

const public = path.join(__dirname, 'public');

app.use(koaStatic(public));

app.use(koaBody({
        urlencoded: true,
        parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE'],
        multipart: true
}));

/********************************************************************************/
/* OPTIONS */
app.use((ctx, next) => {
    console.log('OPTIONS CHECK METHOD PROCESSING')
    if (ctx.request.method !== 'OPTIONS') {
        console.log('----- skipped')
        next();
        return;
    }

    console.log('----- done')
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
    ctx.response.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.response.status = 204;
});

/********************************************************************************/
/* REQUEST LOGGING + universal response headers */
app.use((ctx, next) => {
    console.log('REQUEST DATA METHOD')
    console.log(ctx.headers)
    console.log(ctx.request.query)
    console.log(ctx.request.body)
    ctx.response.set('Access-Control-Allow-Origin', '*');
    next();
});


/********************************************************************************/
/* register router */
app.use(router());

/********************************************************************************/
/* POST */

app.use((ctx, next) => {
    console.log('POST FILES METHOD')
    if (ctx.request.method !== 'POST' || ctx.request.url !== '/upload') {
        console.log('----- skipped')
        next();
        return;
    }
    console.log('----- done')

    console.log(ctx.request.files);
    let fileName;

    try {
        const {file} = ctx.request.files;
        const subfolder = uuid.v4();
        const uploadFolder = public + '/' + subfolder
        fs.mkdirSync(uploadFolder);
        fs.copyFileSync(file.filepath, uploadFolder + '/' + file.originalFilename);
        fileName = '/' + subfolder + '/' + file.originalFilename;
    }
    catch (error) {
        ctx.response.status = 500;
        return;
    }
    ctx.response.body = fileName;
    next();
});


/********************************************************************************/
/* CREATE SERVERs */

const server = http.createServer(app.callback());

const wsServer = new WS.Server({
                        server
                 });

const chat = ['welcome'];

wsServer.on('connection', (ws) => {
    ws.on('message', (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        console.log(message);

        chat.push(message);
        const eventData = JSON.stringify( {chat: [message]} );

        Array.from(wsServer.clients)
            .filter(client => client.readyState === WS.OPEN)
            .forEach(client => client.send(eventData));
    });
    ws.send(JSON.stringify({chat}));
});

/********************************************************************************/
/* RUN SERVER */
const port = 8080;
server.listen(port, (err) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Server is listening to ' + port);
});
