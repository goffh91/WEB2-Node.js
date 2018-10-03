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
          <a href="/create">create</a>
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
            if(queryData.id === undefined)
            {
                fs.readdir('./data', 'utf8', (error, fileList)=>{
                    title = 'Hello';
                    let description = 'This is Node.js App';
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
        else if(pathName === '/create')
        {
            fs.readdir('./data', 'utf8', (error, fileList)=>{
                title = 'WEB - Create';
                let list = getTemplateList(fileList);
                let template = getTemplateHTML(title, list, 
                    `<form method="POST" action="/processCreate">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p><textarea name="description" placeholder="description"></textarea></p>
                        <p><input type="submit" value="submit">
                        <input type="reset" value="reset"></p>
                    </form>`);
                Response.writeHead(200);
                Response.end(template);
            });
        }
        else
        {
            Response.writeHead(404);
            Response.end(`
                <h1>Not Found</h1>
                <p><a href="javascript:" onclick="history.go(-1);">go back</a></p>
            `);
        }
    }
);
app.listen(3000);