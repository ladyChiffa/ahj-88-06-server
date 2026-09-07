const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

app.use(koaBody({
        urlencoded: true
}));

app.use((ctx, next) => {
    console.log(ctx.headers)
    console.log(ctx.request.query)
    console.log(ctx.request.body)

    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.body = 'server response'
    
    next();
});

app.use((ctx) => { 
    console.log(ctx.headers)

    ctx.response.body = 'i am the second middleware'
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