let express = require('express');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
let router = express.Router();


router.get("/", (req, res) => {
    
    res.render("login.ejs");
})


router.post("/", (req, res) =>{
    const userID = req.body.userID;
    const password = req.body.password;
    console.log(req.body);
    console.log(userID);
    console.log(password);
    

    const member = db.get("user")
    .find({userID: userID})
    .value();
    console.log(member);
    let passcheck = member.password;
    console.log(passcheck);

    if(password != passcheck){
        console.log("password가 틀림")
        res.redirect("/member");
    }
    req.session.user = userID;
    req.session.save(function(){
        res.render("index.ejs", {
            user: userID
        })
    })


})

router.get("/register", (req, res) => {
    
    res.render("register.ejs");
})

router.post("/register", (req, res) =>{
    const userID = req.body.userID;
    const email = req.body.email;
    const password = req.body.password;
    
    db.get("user").push({
        userID : userID,
        email : email,
        password : password
    }).write();
    
    res.redirect("/member");
})

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});



module.exports = router;