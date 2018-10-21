let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
let path = require('path');
let sanitizeHTML = require('sanitize-html');
let Nightmare = require('nightmare');
let nightmare = Nightmare({ show: true }); //electron으로 화면을 띄운다
let template = require('./lib/template.js');

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
                fs.readdir('./data', 'utf8', (error, fileList) => {
                    title = 'Hello';
                    let description = 'This is Node.js App';
                    let nav = template.nav(fileList);
                    let html = template.html(title, nav, `<h2>${title}</h2><hr>${description}`, `<a href="/create" class="btn btn-default">create</a>`);
                    Response.writeHead(200, {'Content-Type': 'text/html'});
                    Response.end(html);
                });
            }
            else
            {
                fs.readdir('./data', 'utf8', (error, fileList) => {
                    let filteredId = path.parse(queryData.id).base;
                    let description = fs.readFile(`data/${filteredId}`, 'utf8', 
                    (error, description)=>{
                        /*title = sanitizeHTML(title);
                        description = sanitizeHTML(description, {
                            allowedTags:['a','b','strong','h1','h2','h3','h4','div','img'],
                            allowedAttributes: { 'a':['*'], 'img':['*'], 'div':['*'] },
                            allowedIframeHostnames:['www.youtube.com']
                        });*/
                        let nav = template.nav(fileList);
                        let html = template.html(title, nav, `<h2>${title}</h2><hr>${description}`, 
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
                        Response.writeHead(200, {'Content-Type': 'text/html'});
                        Response.end(html);
                    });
                });
            }
        }
        else if(pathName === '/create')
        {
            fs.readdir('./data', 'utf8', (error, fileList) => {
                title = 'Create';
                let nav = template.nav(fileList);
                let html = template.html(title, nav, 
                    `<form method="POST" action="/processCreate">
                        <div class="form-group">
                            <p><input type="text" class="form-control" name="title" placeholder="title"></p>
                            <p><textarea name="description" class="form-control" rows="10" placeholder="description"></textarea></p>
                            <p class="pull-right"><input type="submit" class="btn btn-default" value="submit">
                            <button type="button" class="btn btn-default" onclick="history.go(-1)">Cancel</button></p>
                        </div>
                    </form>`,'');
                Response.writeHead(200, {'Content-Type': 'text/html'});
                Response.end(html);
            });
        }
        else if(pathName === '/processCreate')
        {
            let body = '';
            Request.on('data', (data) => {
                body += data;
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });
            Request.on('end', (data) => {
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
            fs.readdir('./data', 'utf8', (error, fileList) => {
                let filteredId = path.parse(queryData.id).base;
                let description = fs.readFile(`data/${filteredId}`, 'utf8', 
                (error, description)=>{
                    title = queryData.id;
                    let nav = template.nav(fileList);
                    let html = template.html(title, nav, 
                        `<form method="POST" action="/processUpdate">
                            <input type="hidden" name="id" value="${title}">
                            <p><input type="text" class="form-control" name="title" placeholder="title" value="${title}"></p>
                            <p><textarea name="description" class="form-control" rows="10" placeholder="description">${description}</textarea></p>
                            <p><input type="submit" class="btn btn-default" value="submit">
                            <button type="button" class="btn btn-default" onclick="history.go(-1)">Cancel</button></p>
                        </form>`,'');
                Response.writeHead(200, {'Content-Type': 'text/html'});
                Response.end(html);
                });
            });
        }
        else if(pathName === '/processUpdate')
        {
            let body = '';
            Request.on('data', (data) => {
                body += data;
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });
            Request.on('end', (data) => {
                let post = qs.parse(body);
                let filteredId = path.parse(post.id).base;
                let title = post.title;
                let description = post.description;
                fs.rename(`data/${filteredId}`, `data/${title}`, (error) => {
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
            Request.on('data', (data) => {
                body += data;
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    request.connection.destroy();
            });
            Request.on('end', (data) => {
                let post = qs.parse(body);
                let filteredId = path.parse(post.id).base;
                fs.unlink(`data/${filteredId}`, (error) => {
                    Response.writeHead(302, {Location: `/`});
                    Response.end();
                });
            });
        }
        else if(pathName === '/nightmareForm')
        {
            fs.readdir('./data', 'utf8', (error, fileList) => {    
                title = "Nightmare Form Data 생성";
                let nav = template.nav(fileList);
                let form = template.ntmrForm();
                let html = template.html(title, nav, form, '');
                Response.writeHead(200, {'Content-Type': 'text/html'});
                Response.end(html);
            });
        }
        else if(pathName === '/ntmrProccess')
        {
            let body = '';
            Request.on('data', (data) => {
                body += data;
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    Request.connection.destroy();
            });
            Request.on('end', (data) => {
                let post = qs.parse(body);
                //fs.writeFile(`data/${title}`, description, 'utf8',
                //    (error)=>{
                        Response.writeHead(200, {'Content-Type': 'text/html'});

                        nightmare
                        .goto('http://www.daum.net')    //daum 포털 접속
                        .type('#q', 'blueng.tistory.com')   //blueng.tistory.com 검색어 입력
                        .click('.btn_search')   //검색 버튼을 클릭
                        .wait('#siteColl')  //#siteColl 레이어를 기다린다
                        .end()  //프로세스를 종료한다.
                        .evaluate(() => {
                            return document.querySelector('.wrap_tit a').innerHTML; //첫번째 검색 결과의 제목을 가져온다
                        })
                        .then(res => {
                            console.log(res);   //검색 결과 제목을 콘솔에 출력한다
                        })
                        .catch(err => {
                            console.log('err : ', err);
                        })

                        /*nightmare
                        .goto('http://www.naver.com/')
                        .type('#query', 'phpschool')
                        .click('#search_btn')
                        .wait('#main_pack')
                        // 사이트 검색 결과의 첫 번째 링크 주소를 가져온다.
                        .evaluate(() => document.querySelector('#main_pack div.nsite > ul > li a').href)
                        .then(result => nightmare
                        .goto(result) // 링크 주소로 이동한다.
                        .click('#contentWrap div.main_talkbox a') // 게시판 링크를 클릭한다.
                        .wait('form[name="fboardlist"]') // 게시판 목록을 기다린다.
                        // 목록에서 첫 번째 글 제목을 가져온다.
                        .evaluate(() => document.querySelector('form[name="fboardlist"] > table.board_table > tbody > tr[class=""] > td.subject a').innerHTML)
                        .end())
                        .then(result => console.log(result)) // 결과를 콘솔에 출력한다.
                        .catch(error => console.error(error));*/

                        Response.end('hello');
                //    }
                //);
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