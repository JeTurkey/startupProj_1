


var express               = require("express"),
    expressSanitizer      = require("express-sanitizer"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/users"),
    methodOverride        = require("method-override"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Promise               = require("bluebird"),
    requestPromise        = require("request-promise"),
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
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})




passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// DB Schema config

var usrSchema = new mongoose.Schema({
    usrname: String
})

var companySchema = new mongoose.Schema({
    industry: String,
    name: String,
    field: String,
    location: String,
    createdYear: Number,
    description: String,
    fullname: String,
    population: String,
    detail: String,
    finance: String,
    team: String,
    news: String
})

var newsSchema = new mongoose.Schema({
    Basic: [{
        Source: String,
        Title: String,
        Date: String,
        Month: String
    },
    {ContentScore: Number}
    ],
    Content: [{
        Sentence: String,
        Subject: String,
        Object: String,
        Score: Number
    }]
})

var company = mongoose.model("Company", companySchema)
var news = mongoose.model("new", newsSchema)




// ====================
//     Pre-defined
// ====================

var updateLog=[
    {version: "beta 0.1", date: "2019-07-07", description: "Making sure all pages are working correctly"}
]




// =========================================================================================================
//                                              Routes
// =========================================================================================================

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

    var requests = [{url: "http://hq.sinajs.cn/list=s_sh000001"}, {url: "http://hq.sinajs.cn/list=s_sz399001"}];

    Promise.map(requests, function(obj){
        return requestPromise(obj).then(function(body){
            return body
        });
    }).then(function(results){
        console.log(results);
        res.render("usrHome", {data: results})
    })
    
    // request("http://hq.sinajs.cn/list=s_sh000001", function(error, response, body){
    //     if(!error & response.statusCode == 200) {
    //         var parsedData = body
    //         sciIndex.push(parsedData)
    //     } else {
    //         console.log("Error")
    //         console.log(error)
    //     }
    // })
    // request("http://hq.sinajs.cn/list=s_sz399001", function(error, response, body){
    //     if(!error & response.statusCode == 200) {
    //         var parsedData = body
    //         sheIndex.push(parsedData)
    //     } else {
    //         console.log("Error")
    //         console.log(error)
    //     }
    // })
    // res.render("usrHome", {sciIndex: sciIndex, sheIndex: sheIndex});
})

// GET comments

app.get("/comments", isLoggedIn, function(req, res){
    var comments = [
        {title: "CSRC: 146 Million independent investors in China, 46.6% are chasing after booming", url: "https://wallstreetcn.com/articles/3448807", content: "For exmaple", image: "https://www.thesprucepets.com/thmb/3dF7d-nxYqKk2zs5X0HFLn8ki3w=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/40926432_560505141051912_3896594467564281999_n-5ba052bac9e77c0050e669bb.jpg"},
        {title: "CSRC: 146 Million independent investors in China, 46.6% are chasing after booming", url: "https://wallstreetcn.com/articles/3448807", content: "For exmaple", image: "/assets/img/Corgi_1.jpg"}
    ]
    news.find({}, function(err, allResults){
        if (err) {
            console.log(err)
        } else {
            console.log("Success")
            res.render("comments", {comments: comments, data: allResults});
        }
    })

    
})

// POST comments
app.post("/comments", isLoggedIn, function(req, res){
    
})

// GET Database
app.get("/database", isLoggedIn, function(req, res){
    var query = req.query.search;
    console.log(query)
    company.find({name: new RegExp(query, "i")}, function(err, allResults){
        if (err) {
            console.log("Error")
            console.log(err)
        } else {
            console.log("Success")
            res.render("database", {data: allResults})
        }
    })
    // var url = "http://omdbapi.com/?s=" + query + "&apikey=thewdb";
    // request(url, function(error, response, body){
    // if(!error & response.statusCode == 200) {
    //     var parsedData = JSON.parse(body)
    //     res.render("dataBase", {data: parsedData})
    // }else{
    //     console.log(error)
    // }
    // })
    // res.render("dataBase")
})

// POST Database
app.post("/database", isLoggedIn, function(req, res){
    var name = req.body.companyName
    var location = req.body.location
    var createdYear = req.body.createdYear
    var industry = req.body.industry

    var newCompany = {name: name, location: location, createdYear: createdYear, industry: industry}

    company.create(newCompany, function(err, company){
        if (err) {
            console.log("Error")
        } else {
            console.log("Success")
            console.log(company)
            res.redirect("/database")
        }
    })
})


// GET updateLog

app.get("/updateLog", isLoggedIn, function(req, res){
    res.render("updateLog", {updateLog: updateLog})
})

// GET industry page

app.get("/industry", isLoggedIn, function(req, res){
    company.find({}, function(err, allResults){
        if (err) {
            console.log(err)
        } else {
            console.log("Success")
            
            res.render("industry", {data: allResults})
        }
    })
    
})

// GET addingCompany page
app.get("/database/new", isLoggedIn, function(req, res){
    res.render("addingCompany")
})

app.post("/database/new", isLoggedIn, function(req, res){

})

// Get industryShow page

app.get("/dataBase/:id", isLoggedIn, function(req, res){
    company.findById(req.params.id, function(err, foundCompany){
        if(err){
            console.log(err)
        } else {
            res.render("databaseShow", {data: foundCompany})
        }
    })
})



// =========================================================================================================
//                                             End of Routes
// =========================================================================================================


// =========================================================================================================
//                                              Middle Ware
// =========================================================================================================
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