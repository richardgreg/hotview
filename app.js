var     express                 = require("express"),
        app                     = express(),
        bodyParser              = require("body-parser"),
        mongoose                = require("mongoose"),
        passport                = require("passport"),
        LocalStrategy           = require("passport-local"),
        User                    = require("./models/user"),
        Campground              = require("./models/campground"),
        Comment                 = require("./models/comment"),
        flash                   = require("connect-flash"),
        request                 = require("request"),
        methodOverride          = require("method-override");
        //passportLocalMongoose   = require("passport-local-mongoose"),
        //seedDB                  = require("./seeds");
        

var commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds");

//Passport Configuration
app.use(require("express-session")({
    secret: "ChemicalX",
    resave: false,
    saveUninitialized: false
}));

mongoose.connect("mongodb://localhost:27017/hoview");//localhost:27017 works too
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Parse current user to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Seed the database
//seedDB();

//===================
//Require routes
//===================
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, function(){
    console.log("Hoview server is up and running!!!");
});

app.get("*", function(req, res) {
    res.send("404 Error Not Found!!!");
});
