var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


const express = require('express');
const app = express();
const http = require('http').Server(app);


mongoose.connect("mongodb://localhost/food_app", function (err, db) {
    if (!(err)) console.log("you are connected to mongodb");
    if(err) console.log('not connected to mongodb');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));

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

app.post('/in', function(req,res){ 
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
          
    return res.redirect('/in'); 
})

app.get("/", function (req, res) {
    res.render("index");
});


//handling user sign up
app.post("/register", function (req, res) {
    User.register(new User({ username: req.body.username,email: req.body.email,name: req.body.name }),req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('/register');
        } //user stragety
        passport.authenticate("local")(req, res, function () {
            console.log(req.body.name)
            console.log(req.body.username)
            console.log(req.body.email)
            res.redirect("/in"); //once the user sign up
        });
    });
});

// Login Routes


app.get("/in",isLoggedIn, function (req, res) {
    res.render("in",{name: req.user.username});
    
    console.log(req.user.username);
});
app.get("/",isLoggedIn, function (req, res) {
    res.render("in",{name: req.user.username});
});

// middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/in",
    failureRedirect: "/"
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
    res.redirect("/in");
}

const server = http.listen(8081, function () {
    console.log('listening on *:8081');
});

// module.exports=User;
// module.exports=mongoose;