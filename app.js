const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan')
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

// 라우팅
const crud = require("./router/crud");
app.use("/crud", crud);

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