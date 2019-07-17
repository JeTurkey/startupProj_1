// Author: Rui Shi
// Date: April 23th
// Updated on: Jun 10th


var express               = require("express"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/users"),
    methodOverride        = require("method-override"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    request               = require("request");



// MongoDB connection

mongoose.connect("mongodb://localhost/ttd", { useNewUrlParser: true })


// Settings

var app = express();
app.use(require("express-session")({
    secret: "Hello",
    resave: false,
    saveUninitialized: false
}))
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// DB Schema config

var usrSchema = new mongoose.Schema({
    usrname: String
})



// ====================
//     Pre-defined
// ====================

var updateLog=[
    {version: "beta 0.1", date: "2019-07-07", description: "Making sure all pages are working correctly"}
]


// =====================
//  Routes
// =====================

// GET Login ---- HomePage

app.get("/", function(req, res){
    res.render("index");
})

// POST Login ---- HomePage

app.post("/", passport.authenticate("local", {
    successRedirect: "/usrHome",
    failureRedirect: "/"
}), function(req, res){
    
});

// GET Register page

app.get("/register", function(req, res){
    res.render("register")
});

// POST Register page

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/usrHome");
        })
    });
});

// Log out
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/")
})

// GET usrhomepage
app.get("/usrHome", isLoggedIn, function(req, res){
    res.render("usrHome");
})

// GET comments

app.get("/comments", isLoggedIn, function(req, res){
    var comments = [
        {title: "CSRC: 146 Million independent investors in China, 46.6% are chasing after booming", url: "https://wallstreetcn.com/articles/3448807", content: "For exmaple", image: "https://www.thesprucepets.com/thmb/3dF7d-nxYqKk2zs5X0HFLn8ki3w=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/40926432_560505141051912_3896594467564281999_n-5ba052bac9e77c0050e669bb.jpg"},
        {title: "CSRC: 146 Million independent investors in China, 46.6% are chasing after booming", url: "https://wallstreetcn.com/articles/3448807", content: "For exmaple", image: "/assets/img/Corgi_1.jpg"}
    ]

    res.render("comments", {comments: comments});
})

// POST comments
app.post("/comments", isLoggedIn, function(req, res){
    
})

// GET Database
app.get("/database", isLoggedIn, function(req, res){
    var query = req.query.search;
    var url = "http://omdbapi.com/?s=" + query + "&apikey=thewdb";
    request(url, function(error, response, body){
    if(!error & response.statusCode == 200) {
        var parsedData = JSON.parse(body)
        res.render("dataBase", {data: parsedData})
    }else{
        console.log(error)
    }
    })
    // res.render("dataBase")
})


// GET updateLog

app.get("/updateLog", isLoggedIn, function(req, res){
    res.render("updateLog", {updateLog: updateLog})
})


// middle ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

function isLoggedInHome(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/usrHome');
    }
    return next();
}




// Launching server

app.listen(8080, function(){
    console.log("Server is Running")
})