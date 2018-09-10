var express         = require("express");
var router          = express.Router();
var User            = require("../models/user");
var passport        = require("passport");

//Landing Page
router.get('/', function(req, res){
    res.render("landing");
});

//Register form
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

//Handle signup logic
router.post("/register", function(req, res) {
    // req.body.username;
    // req.body.password;
    var newUser = new User({username: req.body.username});
    if (req.body.adminCode === "AwesomoApp"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//Show Login
router.get('/login', function(req, res){
    res.render("login", {page: 'login'});
});

router.post('/login',passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;