const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(morgan('dev'));

let crud = require("./router/crud");
app.use("/crud", crud);

db.defaults({board: [], user: {}}).write();

app.get('/', (req, res) => {
    res.render("index.ejs");
})

app.use(function(req, res, next){
    res.status(404).render('error404.html');
});

app.listen(port, () => {
    console.log('Server listening ...' + port);
})