let express = require('express');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
let router = express.Router();

// Todo 리스트
router.get("/", (req, res) => {
    
    const posts = db.get("board").value();
    const counts = db.get("board").size().value();
    console.log("crud list 입장");
    
    res.render("crud_list.ejs", {
        posts : posts,
        counts: counts
    });
})

// Todo Create
router.get("/create", (req, res) => {
    res.render("create.ejs");
});

router.post("/create", (req, res) => {
    if(req.session.user){
        var user = req.session.user;
    }else{
        var user = "Not Login";
    }
    const add_title = req.body.title;
    const add_content = req.body.content;
    db.get("board").push({
        title : add_title,
        content : add_content,
        user: user
    }).write();

    res.redirect("/crud");
})

// Todo Read
router.get("/read", (req, res)=>{
    let read_title = req.query.title;
    const post = db.get("board")
    .find({title: read_title})
    .value();
    console.log(post);
    let title = post.title;
    let content = post.content;
    
    res.render("read.ejs", {
        title: title,
        content: content
    });

})

// Todo delete
router.delete("/delete", (req, res) =>{
    let delete_data = req.body.title;
    db.get("board")
    .remove({ title : delete_data })
    .write();
    
    res.redirect("/crud");
})

// Todo update
router.get("/update", (req, res) =>{
    
    let update_title = req.query.title;
    const post = db.get("board")
    .find({title: update_title})
    .value();
    res.render("update.ejs", {
        title: post.title,
        content: post.content
    });
})

router.put("/update", (req, res) =>{
    let update_title = req.body.title;
    let update_content = req.body.content;
    db.get("board")
    .find({ title: update_title})
    .assign({content : update_content})
    .write()

    res.redirect("/crud/read?title="+update_title);
})
module.exports = router;