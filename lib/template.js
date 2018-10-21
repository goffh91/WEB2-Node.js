module.exports = {
    html:function(title, nav, body, control)
    {
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
                <div class='container' style='min-height:600px;'>
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
    },
    nav:function(fileList)
    {
        let ls = '<ul class="dropdown-menu" role="menu">';
        for(let i=0; i<fileList.length; i++)
        {
            ls += `<li><a href='/?id=${fileList[i]}'>${fileList[i]}</a></li>`;
        }
        ls += '</ul>';
        let nav = (`
                <nav class="navbar navbar-inverse" style="border-radius:0;margin-bottom:0;">
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
                        
                        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav">
                            <li class="//active"><a href="#">About </a></li>
                            <li><a href="#">Portfolio</a></li>
                            <li><a href="/nightmareForm">NightmareForm</a></li>
                            <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Docs <span class="caret"></span></a>
                            ${ls}
                            </li>
                        </ul>
                        
                        <ul class="nav navbar-nav navbar-right">
                            <li><a href="#">Contct Me</a></li>
                            <form class="navbar-form navbar-left" role="search">
                            <div class="form-inline">
                                <input type="text" class="form-control" placeholder="Search" style="width:10em;">
                                <input type="submit" class="btn btn-default" value="Search">
                            </div>
                            </form>
                        </ul>
                        
                        </div><!-- /.navbar-collapse -->
                    </div><!-- /.container-fluid -->
                </nav>
            `);
        return nav;
    },
    ntmrForm:function()
    {
        var form = (`
            <hr><h3>Nightmare Form Data 생성</h3>
            <form action="/ntmrProccess" method="POST" onsubmit="sbm_(this.form);">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th colspan="3">
                                <input type="text" class="form-control" id="cmd" placeholder="Command" readonly>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="kv">
                        <tr>
                            <td colspan="2"><input type="text" class="form-control" id="url" placeholder="target URL"></td>
                            <td><input type="submit" class="btn btn-primary" value="생성"></td>
                        </tr>
                        <tr>
                            <td><input type="text" class="form-control" name="key[]" value="" placeholder="key"></td>
                            <td><input type="text" class="form-control" name="val[]" value="" placeholder="value"></td>
                            <td><button type="button" class="btn btn-info" onclick="add_()">+</button></td>
                        </tr>
                    </tbody>
                </table>
            </form><hr>
            <script type="text/javascript">
                console.log
                var cnt = 1;
                /**
                 * author  Kyun Woo Park
                 * param   cnt
                 * for     Add input group of key and value.
                 */
                function add_()
                {
                    if(cnt>5)
                    {
                        alert("더이상 추가할 수 없습니다.");
                        return;
                    }
                    else
                    {
                        cnt++;
                        var objTo = document.getElementById('kv');
                        var crtdiv = document.createElement("tr");

                        crtdiv.innerHTML = '<td><input type="text" class="form-control" name="key[]" value="" placeholder="key"></td><td><input type="text" class="form-control" name="val[]" value="" placeholder="value"></td><td><button type="button" class="btn btn-danger" onclick="del_(this)">-</button></td>';
                        objTo.appendChild(crtdiv);
                    }
                }
                /**
                 * author  Kyun Woo Park
                 * param   cnt
                 * for     Delete input group of key and value.
                 */
                function del_(t)
                {
                    cnt--;
                    t.closest('tr').remove();
                }
                /**
                 * author  Kyun Woo Park
                 * param   form.data
                 * for     Onsubmit function
                 */
                function sbm_(f)
                {
                    var f_arr = f.serializeArray();
                    console.log(f_arr);
                    return false;
                }
            </script>
        `);
        return form;
    }
}