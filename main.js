let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');

function getTemplateHTML(title, list, body, control){
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
          ${control}
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
                    let template = getTemplateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
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
                        let template = getTemplateHTML(title, list, `<h2>${title}</h2>${description}`, 
                            `<a href="/create">create</a> 
                            <a href="/update?id=${title}">update</a> 
                            <form method="POST" action="/proccessDelete" onsubmit="if(confirm('Really wanna delete ${title}?')){this.submit();}">
                                <input type="hidden" name="id" value="${title}">
                                <input type="submit" value="delete">
                            </form>`);
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
                        <button type="button" onclick="history.go(-1)">Cancel</button></p>
                    </form>`,'');
                Response.writeHead(200);
                Response.end(template);
            });
        }
        else if(pathName === '/processCreate')
        {
            let body = '';
            Request.on('data', (data)=>{
                body += data;
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });
            Request.on('end', (data)=>{
                let post = qs.parse(body);
                let title = post.title;
                let description = post.description;
                fs.writeFile(`data/${title}`, description, 'utf8',
                    (error)=>{
                        Response.writeHead(302, {Location: `/?id=${title}`});
                        Response.end();
                    }
                );
            });
        }
        else if(pathName === '/update')
        {
            fs.readdir('./data', 'utf8', (error, fileList)=>{
                let description = fs.readFile(`data/${queryData.id}`, 'utf8', 
                (error, description)=>{
                    title = queryData.id;
                    let list = getTemplateList(fileList);
                    let template = getTemplateHTML(title, list, 
                        `<form method="POST" action="/processUpdate">
                            <input type="hidden" name="id" value="${title}">
                            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                            <p><textarea name="description" placeholder="description">${description}</textarea></p>
                            <p><input type="submit" value="submit">
                            <button type="button" onclick="history.go(-1)">Cancel</button></p>
                        </form>`,'');
                Response.writeHead(200);
                Response.end(template);
                });
            });
        }
        else if(pathName === '/processUpdate')
        {
            let body = '';
            Request.on('data', (data)=>{
                body += data;
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });
            Request.on('end', (data)=>{
                let post = qs.parse(body);
                let id = post.id;
                let title = post.title;
                let description = post.description;
                fs.rename(`data/${id}`, `data/${title}`, (error)=>{
                    fs.writeFile(`data/${title}`, description, 'utf8',
                        (error)=>{
                            Response.writeHead(302, {Location: `/?id=${title}`});
                            Response.end();
                        }
                    );
                });
            });
        }
        else if(pathName === '/proccessDelete')
        {
            let body = '';
            Request.on('data', (data)=>{
                body += data;
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });
            Request.on('end', (data)=>{
                let post = qs.parse(body);
                let id = post.id;
                fs.unlink(`data/${id}`, (error) => {
                    Response.writeHead(302, {Location: `/`});
                    Response.end();
                });
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