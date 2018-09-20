var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Index - show all campgrounds
router.get('/', function(req, res){
    var noMatch = null;
    if (req.query.search) {
        //code for search
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //Get searched campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
            if(err){
                console.log(err);
                console.log("Error");
            }else{
                if(allCampgrounds.length < 1){
                    //You can add flash message here instead!
                    noMatch = "No campgrounds match that query, please try again.";
                }
                res.render("campgrounds/index", {campgrounds:allCampgrounds, noMatch: noMatch, page: 'campgrounds'});
            }
        });
    }else{
        //Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
                console.log("Error");
            }else{
                res.render("campgrounds/index", {campgrounds:allCampgrounds, noMatch:noMatch, page: 'campgrounds'});
            }
        });
    }
});

//CREATE - add new campground
router.post('/', middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, price: price, image:image, description:desc, author:author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log("ERROR!");
        }else{
           console.log(newlyCreated);
           res.redirect("/campgrounds"); 
        }
    });
});

//NEW - Displays "new campground" form
router.get("/new",middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - Shows more info about campgrounds
router.get("/:id", function(req, res) {
    //Find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log("Error");
            req.flash("error", "Campground not found!");
            return res.redirect("back");
        }else{
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    });
    
});

//EDIT Campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit", {campground: foundCampground});   
        }
    });
});

//UPDATE Campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Campground successfully updated.");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//Destroy Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //req.body.blog.campground = req.sanitize(req.body.blog.campground);
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Campground successfully deleted.");
            res.redirect("/campgrounds");
        }
    });
});

//Regular expression for search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;