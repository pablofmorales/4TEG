var app = require('express').createServer();


app.get('/', function(request, response) {
    response.send('Hello world');
});

app.listen(8080);