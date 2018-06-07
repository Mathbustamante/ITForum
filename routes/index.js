var express = require("express");
var router  = express.Router();
var students = require("../models/post");
var moment = require('moment');
//var middleware = require("../middleware");


router.get("/", function(req, res){
    if(req.query.search){
         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
         students.find({description: regex}).sort('-posted').find(function(err, person){
            if(err){
                console.log(err);
            } else  {
                var noMatch;  
                if(students.length < 1){
                    req.flash("error", "No results found");
                } 
                res.render("posts/index", {person: person, noMatch: noMatch, currentUser: req.user, moment: moment});
            }
        });
    } else {

         students.find({}).sort({date: -1}).exec(function(err, person){
            if(err){
                console.log(err);
            } else  {
                res.render("posts/index", {person: person, currentUser: req.user, moment: moment});
            }
        });
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//NEW ROUTE
router.get("/new", isLoggedIn,  function(req, res){
	students.find({}, function(err, student){
        if(err){
            console.log(err);
        } else {
			res.render("posts/new", {student: student});
		}
	});
});

//CREATE ROUTE
router.post("/",isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
    var name = req.body.student.name;
    var email = req.body.student.email;
    var id = req.body.student.id;
    var category = req.body.student.category;
    var question = req.body.student.question;
    var description = req.body.student.description;
   
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = {name: name, question: question, description: description, author: author, category: category}
    // Create a new campground and save to DB
    console.log(newPost);
    students.create(newPost , function(err, newQuestion){
		if(err){
			res.render("posts/new");
		} else {
            console.log(newQuestion);
			res.redirect("/it_forum");
		}
	});
});

//SHOW ROUTE
router.get("/:id", function(req, res){
    students.findById(req.params.id).populate("comments").exec(function(err, foundStudent){
        if(err){
            res.redirect("posts/new");
        } else {
            res.render("posts/show", {student: foundStudent, currentUser: req.user, moment: moment});
        }
    });
});




//EDIT ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    students.findById(req.params.id, function(err, foundStudent){
        res.render("posts/edit", {student: foundStudent});
    });
});


//UPDATE ROUTE 
router.put("/:id", checkCampgroundOwnership, function(req, res) {
    students.findByIdAndUpdate(req.params.id, req.body.student, function(err, updatedPost){
        if(err){
            res.redirect("/it_forum");
        } else {
            res.redirect("/it_forum/" + req.params.id);
        }
    });
});


// DELETE ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res){
   //clock out
   students.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/it_forum");
       } else {
           res.redirect("/it_forum");
       }
   })
 
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
             students.findById(req.params.id, function(err, foundPost) {
                 if(err){
                    //req.flash("error", "Campground not found");
                    res.redirect("back");
                 } else {
                     if(foundPost.author.id.equals(req.user._id)){
                         next();
                     } else{
                         req.flash("error", "You dont have permition to do that");
                         res.redirect("back");
                     }
                    
                 }
            });
        } else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }    
}

module.exports = router;
