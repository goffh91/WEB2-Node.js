let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');

function getTemplateHTML(title, nav, body, control){
    return (`
        <!doctype html>
        <html lang='kr'>
        <head>
            <title>${title} | KW</title>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
        </head>
        <body>
            ${nav}
            <div class='container' style='min-height:500px;'>
                <p>${body}</p>
                <p>${control}</p>
            </div>
            <div class='footer' style='margin:0;padding:1em 2em 1em 2em;background-color:gray;top:0;position:relative;'>
                <span style='color:white;'>
                    <p>Created By KW&emsp;|&emsp;E-mail goffh91@naver.com</p>
                    <p>Copyright © 2018 KW. All Rights Reserved.</p>
                </span>
            </div>
        </body>
        </html>
    `);
}
function getTemplateNav(fileList){
    let ls = '<ul class="dropdown-menu" role="menu">';
    for(let i=0; i<fileList.length; i++)
    {
        ls += `<li><a href='/?id=${fileList[i]}'>${fileList[i]}</a></li>`;
    }
    ls += '</ul>';
    let nav = (`
            <nav class="navbar navbar-inverse" style="border-radius:0;">
                <div class="container-fluid">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="/">KW</a>
                    </div>

                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class="//active"><a href="#">About <span class="sr-only">(current)</span></a></li>
                        <li><a href="#">Portfolio</a></li>
                        <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Skills <span class="caret"></span></a>
                        ${ls}
                        </li>
                    </ul>
                    
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#">Contct Me</a></li>
                        <form class="navbar-form navbar-left" role="search">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Search">
                        </div>
                        <button type="submit" class="btn btn-default">Search</button>
                        </form>
                    </ul>
                    
                    </div><!-- /.navbar-collapse -->
                </div><!-- /.container-fluid -->
            </nav>
        `);
    return nav;
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
                    let nav = getTemplateNav(fileList);
                    let template = getTemplateHTML(title, nav, `<h2>${title}</h2><hr>${description}`, `<a href="/create" class="btn btn-default">create</a>`);
                    Response.writeHead(200);
                    Response.end(template);
                });
            }
            else
            {
                fs.readdir('./data', 'utf8', (error, fileList)=>{
                    let description = fs.readFile(`data/${queryData.id}`, 'utf8', 
                    (error, description)=>{
                        let nav = getTemplateNav(fileList);
                        let template = getTemplateHTML(title, nav, `<h2>${title}</h2><hr>${description}`, 
                            `<form method="POST" action="/proccessDelete" onsubmit="
                                if(confirm('Really wanna delete ${title}?'))
                                    this.submit();
                                else
                                    return false;
                            ">
                                <a href="/create" class="btn btn-default">create</a> 
                                <a href="/update?id=${title}" class="btn btn-default">update</a> 
                                <input type="hidden" name="id" value="${title}">
                                <input type="submit" class="btn btn-default" value="delete">
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
                let nav = getTemplateNav(fileList);
                let template = getTemplateHTML(title, nav, 
                    `<form method="POST" action="/processCreate">
                        <div class="form-group">
                            <p><input type="text" class="form-control" name="title" placeholder="title"></p>
                            <p><textarea name="description" class="form-control" style="min-height:7em;" placeholder="description"></textarea></p>
                            <p class="pull-right"><input type="submit" class="btn btn-default" value="submit">
                            <button type="button" class="btn btn-default" onclick="history.go(-1)">Cancel</button></p>
                        </div>
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
                    let nav = getTemplateNav(fileList);
                    let template = getTemplateHTML(title, nav, 
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