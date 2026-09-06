const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(req.headers);
    res.end();
});

const port = 8080;
server.listen(port, (err) => {
    if(err) {
        console.log(err);
        return;
    }

    
    console.log('Server is listening to ' + port);
})