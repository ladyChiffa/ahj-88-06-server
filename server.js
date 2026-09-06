const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(req.headers);
    
    const buffer = [];
    
    req.on('data', (chunk) => {
        buffer.push(chunk);
    });
    
    req.on('end', () => {
        const data = Buffer.concat(buffer).toString();
        console.log(data);
    });

    res.end('server response')
});

const port = 8080;
server.listen(port, (err) => {
    if(err) {
        console.log(err);
        return;
    }

    
    console.log('Server is listening to ' + port);
})