var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


const express = require('express');
const app = express();



mongoose.connect("mongodb://localhost/food_app", function (err, db) {
    if (!(err)) console.log("you are connected to mongodb");
    if(err) console.log('not connected to mongodb');
});

var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
})

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

app.set('view engine', 'ejs');
//
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post('/', function(req,res){ 
    var Name = req.body.Name; 
    var email =req.body.email; 
    var phonenumber = req.body.phonenumber; 
    var text =req.body.text;
    var data = { 
        "Name": Name, 
        "email":email, 
        "phonenumber":phonenumber, 
        "text":text 
    } 
db.collection('details').insert(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully");
              
    }); 
          
    return res.redirect('/'); 
}) 

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("/")
    // document.getElementById().style.display='none',document.getElementById('id02').style.display='block'
});
//handling user sign up
app.post("/register", function (req, res) {
    User.register(new User({ username: req.body.username,email: req.body.email,name: req.body.name }),req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('/register');
        } //user stragety
        passport.authenticate("local")(req, res, function () {
            document.getElementById('id01').style.display='block'
            document.getElementById('id02').style.display='none'
            res.redirect("/"); //once the user sign up
        });
    });
});

// Login Routes

app.get("/login", function (req, res) {
    res.render("login.ejs");
})

// middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function (req, res) {
    res.send("User is " + req.user.id);
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function(req, res) {
    console.log("Server started at port 3000.....")
}
)

module.exports=User;
module.exports=mongoose;