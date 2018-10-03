let http = require('http');
let fs = require('fs');
let url = require('url');

function getTemplateHTML(title, list, body){
    return (`
        <!doctype html>
        <html lang='kr'>
        <head>
          <title>Welcome - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">Home</a></h1>
          ${list}
          ${body}
        </body>
        </html>
    `);
}
function getTemplateList(fileList){
    let list = '<ul>';
    let i = 0;
    while(i<fileList.length)
    {
        list += `<li><a href='/?id=${fileList[i]}'>${fileList[i]}</a></li>`;
        i = i + 1;
    }
    list += '</ul>';
    return list;
}

let app = http.createServer(
    (Request, Response) => {
        let _url = Request.url;
        let queryData = url.parse(_url, true).query;
        let pathName = url.parse(_url, true).pathname;
        let title = queryData.id;

        if( pathName === '/' )
        {
            // queryDada 에 id가 정의되어 있지 않은 경우.
            if(queryData.id === undefined)
            {
                fs.readdir('./data', 'utf8', (error, fileList)=>{
                    title = 'Node.js';
                    let description = 'As an asynchronous event driven JavaScript runtime, Node is designed to build scalable network applications. In the following "hello world" example, many connections can be handled concurrently. Upon each connection the callback is fired, but if there is no work to be done, Node will sleep.';
                    let list = getTemplateList(fileList);
                    let template = getTemplateHTML(title, list, `<h2>${title}</h2>${description}`);
                    Response.writeHead(200);
                    Response.end(template);
                });
            }
            else
            {
                fs.readdir('./data', 'utf8', (error, fileList)=>{
                    let description = fs.readFile(`data/${queryData.id}`, 'utf8', 
                    (error, description)=>{
                        let list = getTemplateList(fileList);
                        let template = getTemplateHTML(title, list, `<h2>${title}</h2>${description}`);
                        Response.writeHead(200);
                        Response.end(template);
                    });
                });
            }
        }
        else
        {
            Response.writeHead(404);
            Response.end('Not Found');    
        }
    }
);
app.listen(3000);