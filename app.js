var express     = require("express");
    app         = express(),
    methodOverride = require("method-override"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport = require("passport"),
    User        = require("./models/user"),
    LocalStrategy = require("passport-local"),
    students = require("./models/post");
    Comment = require("./models/comment");
    seedDB = require("./seeds");



//seedDB();
mongoose.connect("mongodb://WITS:admin@ds231090.mlab.com:31090/it_forum");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

//PASSPORT CONFIGURATION 
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


// students.create(
//     {
//          name: "Will Maynard",
//          email:"",
//          id: "827248",
//          question: "??????"
         
//      }
    
// );



//ROUTES
//INDEX ROUTE
app.get("/", function(req, res){
    res.redirect("/it_forum");
});


app.get("/it_forum", function(req, res){
    if(req.query.search){
         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
         students.find({question: regex}, function(err, person){
            if(err){
                console.log(err);
            } else  {
                var noMatch;  
                if(students.length < 1){
                    noMatch = "No results found.";
                } 
                res.render("posts/index", {person: person, noMatch: noMatch});
            }
        });
    } else {

         students.find({}, function(err, person){
            if(err){
                console.log(err);
            } else  {
                res.render("posts/index", {person: person});
            }
        });
    }
});

//NEW ROUTE
app.get("/it_forum/new", function(req, res){
	students.find({}, function(err, student){
        if(err){
            console.log(err);
        } else {
			res.render("posts/new", {student: student});
		}
	});
});

//CREATE ROUTE
app.post("/it_forum", function(req, res){
	students.create(req.body.student, function(err, newQuestion){
		if(err){
			res.render("posts/new");
		} else {
			res.redirect("/it_forum");
		}
	});
});

//SHOW ROUTE
app.get("/it_forum/:id", function(req, res){
    students.findById(req.params.id).populate("comments").exec(function(err, foundStudent){
        if(err){
            res.redirect("posts/new");
        } else {
            res.render("posts/show", {student: foundStudent});
        }
    });
});




//EDIT ROUTE
app.get("/it_forum/:id/edit", function(req, res){
    students.findById(req.params.id, function(err, foundStudent){
        if(err){
            res.redirect("/it_forum");
        } else {
            res.render("posts/edit", {student: foundStudent});
        }
    });
});

//UPDATE ROUTE 
app.put("/it_forum/:id", function(req, res) {
    students.findByIdAndUpdate(req.params.id, req.body.student, function(err, updatedPost){
        if(err){
            res.redirect("/it_forum");
        } else {
            res.redirect("/it_forum/" + req.params.id);
        }
    });
});


// DELETE ROUTE
app.delete("/it_forum/:id", function(req, res){
   //clock out
   students.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/it_forum");
       } else {
           res.redirect("/it_forum");
       }
   })
 
});


//AUTH ROUTES
//Show register form 

app.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res){
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


// //Show login form

// app.get("/login", function(req, res) {
//     res.render("login");
// })

// app.post("/login", passport.authenticate("local", 
//     {
//         successRedirect: "/campgrounds",
//         failureRedirect: "/login"
//     }), function(req, res) {
    
// });

// //Logout ROUTE

// app.get("/logout", function(req, res) {
//     req.logout();
//     req.flash("success", "You need to be logged in to do that");
//     res.redirect("/campgrounds");
// });

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "Please login first!");
//     res.redirect("/login");
// }

// function checkCampgroundOwnership(req, res, next){
//     if(req.isAuthenticated()){
//              Campground.findById(req.params.id, function(err, foundCampground) {
//                  if(err){
//                     req.flash("error", "Campground not found");
//                     res.redirect("back");
//                  } else {
//                      if(foundCampground.author.id.equals(req.user._id)){
//                          next();
//                      } else{
//                           req.flash("error", "You dont have permition to do that");
//                          res.redirect("back");
//                      }
                    
//                  }
//             });
//         } else{
//             req.flash("error", "You need to be logged in to do that");
//             res.redirect("back");
//         }    
// }

// function checkCommentdOwnership(req, res, next){
//     if(req.isAuthenticated()){
//              Comment.findById(req.params.comment_id, function(err, foundComment) {
//                  if(err){
//                     res.redirect("back");
//                  } else {
//                      if(foundComment.author.id.equals(req.user._id)){
//                          next();
//                      } else{
//                           req.flash("error", "You dont have permition to do that");
//                          res.redirect("back");
//                      }
                    
//                  }
//             });
//         } else{
//             req.flash("error", "You need to be logged in to do that");
//             res.redirect("back");
//         }    
// }




//=====================
//COMMENTS ROUTES
//=====================

app.get("/it_forum/:id/comments/new", function(req, res){
    // find campground by id
    students.findById(req.params.id, function(err, foundStudent){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {student: foundStudent});
        }
    });
});

app.post("/it_forum/:id/comments", function(req, res){
   //lookup campground using ID
   students.findById(req.params.id, function(err, post){
       if(err){
           console.log(err);
           res.redirect("/it_forum");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
              
               post.comments.push(comment);
               post.save();
            
               res.redirect('/it_forum/' + post._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

// app.get("/it_forum/:id/comments/:comment_id/edit", function(req, res) {
//     Comment.findById(req.params.comment_id, function(err, foundComment){
//       if(err){
//           res.redirect("back");
//       } else {
//         res.render("comments/edit", {student_id: req.params.id, comment: foundComment});
//       }
//    });
// });

// // COMMENT UPDATE
// app.put("/it_forum/:id/comments/:comment_id", checkCommentdOwnership, function(req, res){
//    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
//       if(err){
//           res.redirect("back");
//       } else {
//           res.redirect("/it_forum/" + req.params.id );
//       }
//    });
// });

// // COMMENT DESTROY ROUTE
// app.delete("/it_forum/:comment_id", checkCommentdOwnership,  function(req, res){
//     //findByIdAndRemove
//     Comment.findByIdAndRemove(req.params.comment_id, function(err){
//        if(err){
//            res.redirect("back");
//        } else {
//            res.redirect("/it_forum/" + req.params.id);
//        }
//     });
// });


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



app.listen(3000, function(){
	console.log("Server has started on port 3000");
});




	

