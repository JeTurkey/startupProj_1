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
    request               = require("request"),
    governmentcontract    = require("./models/governmentContractDB"),
    updateLog             = require("./models/updateLogDB"),
    blockchaincompany     = require("./models/blockchainCompanyDB"),
    xinwen                = require("./models/xinwenDB"),
    tag                   = require("./models/tagDB"),
    score                 = require("./models/scoreBaseDB"),
    moment                = require("moment");




    




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

var ObjectId = mongoose.Schema.Types.ObjectId;

var usrSchema = new mongoose.Schema({
    usrname: String
})

var productSchema = new mongoose.Schema({
    detailName: String,
    detailDescription: String
})

var product = mongoose.model("product", productSchema)

// var detailSchema = new mongoose.Schema({
//     detailName: String,
//     detailDescription: String
// })

// var detail = mongoose.model("detail", detailSchema)

var financeSchema = new mongoose.Schema({
    financeDate: String,
    financeRound: String,
    financeAmount: String,
    financeCurrency: String,
    financeInvestor: String
})

var finance = mongoose.model("finance", financeSchema)

var teamSchema = new mongoose.Schema({
    teamName: String,
    teamPosition: String,
    teamBackground: String
})

var team = mongoose.model("team", teamSchema)

// var companyNewsSchema = new mongoose.Schema({
//     newsTitle: String,
//     newsSource: String,
//     newsDate: String,
//     newsContent: String
// })

// var companyNews = mongoose.model("news", companyNewsSchema)


// var companySchema = new mongoose.Schema({
//     industry: String,
//     name: String,
//     field: String,
//     location: String,
//     createdYear: Date,
//     description: String,
//     fullname: String,
//     population: String,
//     productDetail: [productSchema],
//     finance: [financeSchema],
//     team: [teamSchema],
//     news: [companyNewsSchema]
// })

// var newsSchema = new mongoose.Schema({
//     source: String,
//     title: String,
//     date: Date,
//     content: String,
//     tags: Array,
//     originalLink: String
// })

// var sentenceSchema = new mongoose.Schema({
//     reference: ObjectId,
//     sentence: String,
//     subject: String,
//     object: String,
//     score: Number
    
// })



// var company = mongoose.model("Company", companySchema)
// // var news = mongoose.model("new", newsSchema)
// var sentence = mongoose.model("sentence", sentenceSchema)

var governmentSchema = new mongoose.Schema({
    projectPublicName: String,
    projectName: String,
    subject: String,
    province: String,
    items: Array,
    amount: Number,
    object: String,
    intermediate: String
})

var government = mongoose.model('government', governmentSchema)

// var blockchainCompanySchema = new mongoose.Schema({
//     companyCode: String,
//     companyName: String,
//     segment: String,
//     newestFinance: String,
//     serviceType: String,
//     yearFounded: Date,
//     region: String
// })

// var blockchaincompany = mongoose.model('blockchaincompany', blockchainCompanySchema)

var tagDescriptionSchema = new mongoose.Schema({
    tag: String,
    description: String
})

var tagdescription = mongoose.model('tagdescription', tagDescriptionSchema)




// ====================
//     Pre-defined
// ====================






// =========================================================================================================
//                                              Routes
// =========================================================================================================

// GET Login ---- HomePage

// app.get("/", function(req, res){
//     res.render('index')
// })
var index = require('./models/indexGet.js')
app.use('/', index)


// POST Login ---- HomePage

app.post("/", passport.authenticate("local", {
    successRedirect: "/usrHome",
    failureRedirect: "/"
}), function(req, res){
    
});

// GET Portfolio
app.get("/portfolio", function(req, res){
    res.render("portfolio")
})

// GET Register page

app.get("/register", function(req, res){
    res.render("register")
});

// POST Register page

app.post("/register", function(req, res){
    if(req.body.companyID == 320131 || req.body.companyID == 336699 ){
        User.register(new User({username: req.body.username, companyID: req.body.companyID}), req.body.password, function(err, user){
            if(err){
                console.log(err);
                return res.render("register");
            }
            passport.authenticate("local")(req, res, function(){
                res.redirect("/usrHome");
            })
        });
    } else {
        alert("公司代码错误，请咨询管理员获取公司代码。Invalid company code, please contact manager for the code")
    }
    
});

// Log out
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/")
})

// GET usrhomepage
app.get("/usrHome", isLoggedIn, function(req, res){

    // var requests = [{url: "http://hq.sinajs.cn/list=s_sh000001"}, {url: "http://hq.sinajs.cn/list=s_sz399001"}];
    // // Promise allows to request several urls at a time
    // Promise.map(requests, function(obj){
    //     return requestPromise(obj).then(function(body){
    //         return body
    //     });
    // }).then(function(results){
    //     console.log('request内容获取')
    //     res.render("usrHome", {data: results})

    //         })
    res.render("usrHome")
        })


// GET comments

app.get("/news", isLoggedIn, function(req, res){
    var comments = [
        {title: "CSRC: 146 Million independent investors in China, 46.6% are chasing after booming", url: "https://wallstreetcn.com/articles/3448807", content: "For exmaple", image: "https://www.thesprucepets.com/thmb/3dF7d-nxYqKk2zs5X0HFLn8ki3w=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/40926432_560505141051912_3896594467564281999_n-5ba052bac9e77c0050e669bb.jpg"},
        {title: "CSRC: 146 Million independent investors in China, 46.6% are chasing after booming", url: "https://wallstreetcn.com/articles/3448807", content: "For exmaple", image: "/assets/img/Corgi_1.jpg"}
    ]
    news.find({},{}, {limit: 10}, function(err, allResults){
        if (err) {
            console.log(err)
        } else {
            console.log("Success")
            res.render("news", {comments: comments, data: allResults});
        }
    })

    
})



// GET news page
app.get("/addingNews", isLoggedIn, function(req, res){
    res.render("addNews")
})

// POST news page
app.post("/addingNews/addingNewsPost", isLoggedIn, function(req, res){
    var newsTitle = req.body.title;
    var newsDate = req.body.date;
    var newsSource = req.body.source;
    var newsContent = req.body.content;
    var newsSubmitter = req.body.submitter;

    var lines = newsContent.split('\n');
    var newsContentModified = ""
    for(var i = 0;i < lines.length;i++){
        //code here using lines[i] which will give you each line
        newsContentModified += "<p>" + lines[i].replace(/[\r\n]/g,"") + "</p>";
    }

    xinwen.create({
        title: newsTitle,
        dateAdded: newsDate,
        source: newsSource,
        content: newsContentModified
        // content: newsContent
    }, function(err, rst){
        if (err){
            return err
        }else{
            console.log('News has been successfully saved')
            updateLog.create({
                title: "添加新闻操作",
                date: newsDate,
                editor: res.locals.currentUser.username,
                content: res.locals.currentUser.username + " 添加了 " + newsTitle

            }, function(err2, rst2){
                if(err2){
                    return err2
                }else{
                    console.log('log has been added')
                    res.redirect("/usrHome")
                }
            })
        }

    })

})



// GET Database
app.get("/database", isLoggedIn, function(req, res){
    var query = req.query.search;
    console.log(query)
    company.find({name: new RegExp(query, "i")}, {}, {limit: 10}, function(err, allResults){
        if (err) {
            console.log("Error")
            console.log(err)
        } else {
            console.log("Success")
            res.render("database", {data: allResults})
        }
    })
})


// GET updateLog

app.get("/updateLog", isLoggedIn, function(req, res){
    updateLog.find({}).sort({_id: -1}).limit(6).exec(function(err, rst){
        // console.log(rst)
        res.render("updateLog", {updateLog: rst})
    })
    
})

// GET industry page

app.get("/industry", isLoggedIn, function(req, res){
    blockchaincompany.aggregate([{$group: {_id: '$yearFounded', count: {$sum: 1}}}]).exec(function(err, countByYear){
        if(err){
            return err
        } else {
            blockchaincompany.aggregate([{$group: {_id: '$region', count: {$sum: 1}}}, {$sort: {count: -1}}]).exec(function(err2, countByRegion){
                if (err2){ 
                    return err2
                } else {
                    var region = []
                    var countInRegion = []
                    for(var i = 0; i <= 10; i++){
                        region.push(countByRegion[i]._id)
                        countInRegion.push(countByRegion[i].count)
                    }
                    blockchaincompany.aggregate([{$group: {_id: '$segment', count: {$sum: 1}}}, {$sort: {count: -1}}]).exec(function(err3, countBySegment){
                        if(err3){
                            return err3
                        } else {
                            var segment = []
                            var countInSegment = []
                            for (var i = 0; i<= 10; i++){
                                segment.push(countBySegment[i]._id)
                                countInSegment.push(countBySegment[i].count)
                            }
                            console.log(segment)
                            console.log(countInSegment)
                            res.render('industry', {countByYear: countByYear, region: region, countInRegion: countInRegion, segment: segment, countInSegment: countInSegment})

                        }
                    })
                    
                }
            })
            
        }
    })

})

// GET addingCompany page
app.get("/database/new", isLoggedIn, function(req, res){
    res.render("addingCompany")
})

app.post("/database/new", isLoggedIn, function(req, res){
    var industry = req.body.industry
    var name = req.body.name
    var location = req.body.location
    var field = req.body.field
    var createdYear = req.body.createdYear
    var description = req.body.description
    var fullName = req.body.fullName
    var population = req.body.population
    var detailName = req.body.detail
    var detailDescription = req.body.detailDescription
    var financeDate = req.body.financeDate
    var financeRound = req.body.financeRound
    var financeAmount = req.body.financeAmount
    var financeCurrency = req.body.financeCurrency
    var financeInvestor = req.body.financeInvestor
    var teamName = req.body.teamName
    var teamPosition = req.body.teamPosition
    var teamBackground = req.body.teamBackground
    var newsTitle = req.body.newsTitle
    var newsSource = req.body.newsSource
    var newsDate = req.body.newsDate
    var newsContent = req.body.newsContent




    var newCompany = new company({indsutry: industry, name: name, location: location, field: field, createdYear: createdYear,
                      description: description, fullName: fullName, population: population});
    
    if(typeof(detailName) === 'object' && detailName!= null){
        for(var i = 0; i < detailName.length; i++) {
            newCompany.productDetail.push({
                detailName: detailName[i],
                detailDescription: detailDescription[i]
            })
        }
    } else {
        newCompany.productDetail.push({
            detailName: detailName,
            detailDescription: detailDescription
        })
    }
   
    console.log("产品细节输入完毕")
    if(typeof(financeDate) === 'object' && financeDate!= null){
        for(var i = 0; i < financeDate.length; i++){
            newCompany.finance.push({
                financeDate: financeDate[i],
                financeRound: financeRound[i],
                financeAmount: financeAmount[i],
                financeCurrency: financeCurrency[i],
                financeInvestor: financeInvestor[i]
            })
        }
    } else {
        newCompany.finance.push({
            financeDate: financeDate,
            financeRound: financeRound,
            financeAmount: financeAmount,
            financeCurrency: financeCurrency,
            financeInvestor: financeInvestor
        })
    }

    console.log("融资信息输入完成")

    if(typeof(teamName) === 'object' && teamName != null){
        for(var i = 0; i < teamName.length; i++){
            newCompany.team.push({
                teamName: teamName[i],
                teamPosition: teamPosition[i],
                teamBackground: teamBackground[i]
            })
        }
    } else {
        newCompany.team.push({
            teamName: teamName,
            teamPosition: teamPosition,
            teamBackground: teamBackground
        })
    }

    console.log("团队信息储存")

    if (typeof(newsTitle) === 'object' && newsTitle != null){
        for(var i = 0; i < newsTitle.length; i++){
            newCompany.news.push({
                newsTitle: newsTitle[i],
                newsSource: newsSource[i],
                newsDate: newsDate[i],
                newsContent: newsContent[i]
            })
        }
    } else {
        newCompany.news.push({
            newsTitle: newsTitle,
            newsSource: newsSource,
            newsDate: newsDate,
            newsContent: newsContent
        })
    }
    
    console.log("新闻信息储存")


    company.create(newCompany, function(err, company){
        if (err) {
            console.log("Error")
            console.log(err)
        } else {
            console.log("New company has been added Successfully")
            console.log(company)
            res.redirect("/database")
        }
    })
})



// Get industryShow page

app.get("/database/:id", isLoggedIn, function(req, res){
    company.findById(req.params.id, function(err, foundCompany){
        if(err){
            console.log(err)
        } else {
            res.render("databaseShow", {data: foundCompany})
        }
    })
})

// Edit industryShow page

app.get("/database/:id/edit", isLoggedIn, function(req, res){
    company.findById(req.params.id, function(err, companyInfo){
        if (err) {
            console.log(err)
        } else {
            res.render("databaseUpdate", {data: companyInfo})
        }
    })
})

// Get industryEmotion page

app.get("/industryEmotion", isLoggedIn, function(req, res){
    tag.find({}, function(err, rst){
        if (err) {
            return err
        } else {
            res.render('industryEmotion', {data: rst})
        }
    })
    
    
})


// 细分行业关键字页面

app.get("/industryEmotion/:id", isLoggedIn, function(req, res){

    score.find({firmName: req.params.id}).sort({ "scoreDate": 1}).exec(function(err, rst){
        if (err){
            return err
        } else {
            
            res.render('specificIndustry', {data: rst, title: req.params.id})
        }
    })

    // score.find({firmName: req.params.id}, function(err, rst){
    //     if (err){
    //         return err
    //     } else {
    //         console.log(req.params.id)
    //         console.log(rst)
    //         res.render('specificIndustry', {data: rst})
    //     }
    // })

    
})

// 政府行业搜索页面

app.get("/governmentSearch", isLoggedIn, function(req, res){
    // 
    res.render("governmentSearch")
})

// 政府行业搜索检索功能的API

app.get("/governmentDatabaseSearch", isLoggedIn, function(req, res){
    var locations = req.query.location
    var industries = req.query.industry

    console.log(locations)
    console.log('-----')
    console.log(industries)

    government.find({$or: [{region: locations}, 
                           {industry: industries},
                           {region: locations, industry: industries}]}, function(err, rst){
        if(err){
            return err
        } else {
            console.log(rst)
            res.render('governmentSearchResult', {data: rst})
        }
    })
})

// 政府行业全景图 页面

app.get("/governmentGlance", isLoggedIn, function (req, res) {


    governmentcontract.aggregate([{
            $group: {
                _id: '$location',
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }, {
            $limit: 10
        }
    ]).exec(
        function (err, countByLocation) {
            if (err) {
                console.log('Error 了')
                return err
            } else {

                governmentcontract.aggregate([{
                        $group: {
                            _id: '$caigouneirong',
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $sort: {
                            count: -1
                        }
                    }, {
                        $limit: 11
                    }
                ]).exec(
                    function (err, countBySegment) {
                        if (err) {
                            return err
                        } else {
                            governmentcontract.aggregate([{
                                $group: {
                                    _id: '$date',
                                    count: {
                                        $sum: 1
                                    }
                                }
                            }, {
                                $sort: {
                                    _id: -1
                                }
                            }, {$limit: 30}
                        ], function (err, countByDate) {
                            governmentcontract.aggregate([{ $match: {title: {$regex: "医疗"}}},{ $group: {_id: "$date", count: {$sum: 1}}}, {$sort: {"_id": -1}}, {$limit: 30}], function(err, countInMedEquip){
                                res.render('governmentGlance', {
                                    countByLocation: countByLocation,
                                    countBySegment: countBySegment,
                                    countByDate: countByDate,
                                    countInMedEquip: countInMedEquip
                                })
                            })
                                
                            })
                        }
                    }
                )
            }

        }
    )



})

app.get("/governmentDatabaseBlurSearch", isLoggedIn, function(req, res){
    var searchField = req.query.search

    console.log(searchField)

    government.find({$or: [{projectPublicName: {$regex: searchField}},
                           {industry: {$regex: searchField}},
                           {projectName: {$regex: searchField}},
                           {region: {$regex: searchField}}
    ]}, function(err, rst){
        if (err) {
            return err
        } else {
            console.log(rst)
            res.render('governmentSearchResult', {data: rst})
        }
    })


})

app.get('/blockchainDatabaseSearch',  isLoggedIn, function(req, res){

    var location = req.query.location
    var segment = req.query.segment

    console.log(location)
    console.log('-----')
    console.log(segment)



    blockchaincompany.find({$or: [{region: location}, 
                            {segment: segment},
                            {region: location, segment: segment}]}, function(err, rst){
            if(err){
            return err
            } else {
            console.log(rst)
            res.render('blockchainSearchResult', {data: rst})
            }
            })

    
    
})

app.get('/blockchainDatabaseBlurSearch', isLoggedIn, function(req, res){
    var searchField = req.query.search

    console.log(searchField)

    blockchaincompany.find({companyName: {$regex: searchField}

    }, function(err, rst){
        if(err) {
            return err
        } else {
            console.log(rst)
            res.render('blockchainSearchResult', {data: rst})
        }
    })

   
})

app.get('/newUpdate', isLoggedIn, function(req, res){
    res.render('newUpdate')
})

app.post('/newUpdatePost', isLoggedIn, function(req, res){
    updateLog.create({
        title: req.body.updateTitle,
        editor: req.body.updateEditor,
        date: req.body.updateDate,
        content: req.body.updateConent
    }, function(err, rst){
        if (err){
            return err
        } else {
            console.log('update saved ')
            
            res.redirect('updateLog')
            res.alert("新闻已成功储存")
        }
    })
})

app.get('/generalNews', isLoggedIn, function(req, res){
    xinwen.find({}).sort({ "dateAdded": -1}).limit(20).exec(function(err, rst){
        if(err){
            return err
        } else {
            res.render('generalNews', {data: rst})
        }
    })
//     xinwen.aggregate([{
//         $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateAdded" } }
//         }
//     }, {
//         $sort: {
//             _id: -1
//         }
//     }, {$limit: 30}
// ], function (err, rst){
//     if (err){
//         return err
//     } else{
//         console.log(rst)
//         res.render('generalNews', {data: rst})
//     }
// }) 
    
})

app.get('/generalNews/:id', isLoggedIn, function(req, res){
    xinwen.find({_id: req.params.id}, function(err, rst){
        if (err){
            return err
        } else {
            res.render('taggingNews', {data: rst})
        }
    })
})

app.get('/chinaProvincialGraph', isLoggedIn, function(req, res){
    res.render('chinaProvinceGraph')
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