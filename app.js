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
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
//
app.use(passport.initialize());
app.use(passport.session());
// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
    res.render("index");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});
//handling user sign up
app.post("/register", function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } //user stragety
        passport.authenticate("local")(req, res, function () {
            res.redirect("/login"); //once the user sign up
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