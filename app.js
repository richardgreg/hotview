var     express                 = require("express"),
        app                     = express()
        bodyParser              = require("body-parser");
        mongoose                = require("mongoose");

var campgrounds = [
        {name: "Salmon Creek", image: "https://images.pexels.com/photos/965153/pexels-photo-965153.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
        {name: "Mountain Dew", image: "https://images.pexels.com/photos/756780/pexels-photo-756780.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
        {name: "Savannah Valley", image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}
        ];

mongoose.connect("mongodb://localhost/hoview");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get('/', function(req, res){
    res.render("landing");
});

app.get('/campgrounds', function(req, res){
    

    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name, image:image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(3000, function(){
    console.log("Hoview server is up and running!!!");
});

app.get("*", function(req, res) {
    res.send("404 Error Not Found!!!");
});
