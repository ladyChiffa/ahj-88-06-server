const http = require('http');
const Koa = require('koa');
const {koaBody} = require('koa-body');

const app = new Koa();

let subscriptions = [];

app.use(koaBody({
        urlencoded: true,
        parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE']
}));


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
    ctx.response.status = 204;
});


app.use((ctx, next) => {
    console.log('REQUEST DATA METHOD')
    console.log(ctx.headers)
    console.log(ctx.request.query)
    console.log(ctx.request.body)
    ctx.response.set('Access-Control-Allow-Origin', '*');
    next();
});

app.use((ctx, next) => {
    console.log('POST METHOD')
    if (ctx.request.method !== 'POST') {
        console.log('----- skipped')
        next();
        return;
    }
    console.log('----- done')

    const {name, phone} = ctx.request.body;
    if (subscriptions.some(sub => sub.phone === phone)) {
        ctx.response.status = 400;
        ctx.response.body = 'subscription exists';
    }
    else {
        subscriptions.push({name, phone});
        ctx.response.body = 'OK';
    }

    next();
});

app.use((ctx, next) => {
    console.log('DELETE METHOD')
    if (ctx.request.method !== 'DELETE') {
        console.log('----- skipped')
        next();
        return;
    }
    console.log('----- done')

    const {name, phone} = ctx.request.body;
    if (subscriptions.every(sub => sub.phone !== phone)) {
        ctx.response.status = 400;
        ctx.response.body = 'subscription doesnt exist';
    }
    else {
        subscriptions = subscriptions.filter(sub => sub.phone !== phone);
        ctx.response.body = 'OK';
    }

    next();
});


const server = http.createServer(app.callback());

const port = 8080;
server.listen(port, (err) => {
    if(err) {
        console.log(err);
        return;
    }

    
    console.log('Server is listening to ' + port);
})