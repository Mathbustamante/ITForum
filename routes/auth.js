var express = require("express");
var router  = express.Router();
var students = require("../models/post");
var passport = require("passport");
var User = require("../models/user");



router.get("/", function(req, res){
    res.render("landing");
});

router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render("register", {"error": err.message});
       } 
        passport.authenticate("local")(req, res, function(){
            
            res.redirect("/it_forum");
        });
   }); 
});


//Show login form
router.get("/login", function(req, res) {
    res.render("login");
})

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/it_forum",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

//Logout ROUTE

router.get("/logout", function(req, res) {
    req.logout();
    // req.flash("success", "You need to be logged in to do that");
    res.redirect("/it_forum");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "Please login first!");
    res.redirect("/login");
}

module.exports = router;