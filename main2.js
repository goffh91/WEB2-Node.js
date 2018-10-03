var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(
    (Request ,Response) => 
    {
        var url = Request.url;
        var queryData = url.parse(_url, true).query;
        for(i in queryData)
        {
            console.log(queryData[i]);
        }
        if(url === '/')
        {
            url = '/index.html';
        }
        if(url === '/favicon.ico')
        {
            Response.writeHead(404);
            Response.end();
            return;
        }
        Response.writeHead(200);
        var data = fs.readFileSync(__dirname + url);
        Response.end(data);
    }
);
app.listen(3000);