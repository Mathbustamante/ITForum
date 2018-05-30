var express         = require("express");
    app             = express(),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    User            = require("./models/user"),
    LocalStrategy   = require("passport-local"),
    Comment         = require("./models/comment"),
    seedDB          = require("./seeds");


//Use seedDB to manually add posts and comments (Used for testing purposes)
//seedDB();

//========================
//REQUIRE ROUTES
//======================== 
var commentRoutes = require("./routes/comments"),
    indexRoutes   = require("./routes/index"),
    authRoutes    = require("./routes/auth");
//========= END REQUIRE ROUTES ===============


mongoose.connect("mongodb://WITS:admin@ds231090.mlab.com:31090/it_forum");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));


//========================
//PASSPORT CONFIGURATION
//======================== 
app.use(require("express-session")({
    secret: "Matheus Bustamante",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//========= END PASSPORT ===============


//========================
//USE ROUTES
//======================== 
app.use("/", authRoutes);
app.use("/it_forum/:id/comments", commentRoutes);
app.use("/it_forum" ,indexRoutes);
//========= END USE ROUTES ===============


//========================
//INITIALIZE SERVER ON PORT 3000
//======================== 
// app.listen(3000, function(){
// 	console.log("Server has started on port 3000");
// });
//========= END USE INITIALIZE SERVER ON PORT 3000 ===============


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("it_forum server is running!!");
});

// students.create(
//     {
//          name: "Will Maynard",
//          email:"",
//          id: "827248",
//          question: "??????"
         
//      }
    
// );


	

