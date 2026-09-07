const http = require('http');
const Koa = require('koa');

const app = new Koa();
app.use((ctx, next) => {
    console.log(ctx.headers)

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