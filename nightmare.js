let http = require('http');
let url = require('url');
let qs = require('querystring');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true }); //electron으로 화면을 띄운다

let app = http.createServer(
    (Request, Response) => {
        let _url = Request.url;
        let queryData = url.parse(_url, true).query;
        let pathName = url.parse(_url, true).pathname;

        if( pathName === '/' )
        {
            if(queryData.id === undefined)
            {
                Response.writeHead(200);
                Response.end('/inputForm.html');
            }
        }
    }
);
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

/*nightmare
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
    })*/