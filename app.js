const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan')
const session = require("express-session");
const cookieparser = require("cookie-parser");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const port = 3000;
                                                             

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"))

app.use(cookieparser());
app.use(
  session({
    key: "sid",
    secret: "1A@W#E$R",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 500 * 60 * 60
    }
    // key: 세션의 키 값
    // secret: 세션의 비밀 키, 쿠키값의 변조를 막기 위해서 이 값을 통해 세션을 암호화 하여 저장
    // resave: 세션을 항상 저장할 지 여주(false를 권장)
    // saveUninitialized: 세션이 저장되기전에 uninitialize 상태로 만들어 저장
    // cookie: 쿠키 설정
  })
);

// 라우팅
const crud = require("./router/crud");
const member = require("./router/member");
app.use("/crud", crud);
app.use("/member", member);

// lowdb 기본 세팅
db.defaults({board: [], user: {}}).write();

// index page 이동
app.get('/', (req, res) => {
    res.render("index.ejs");
})

app.use(function(req, res, next){
    res.status(404).render('error404.html');
});

app.listen(port, () => {
    console.log('Server listening ...' + port);
})