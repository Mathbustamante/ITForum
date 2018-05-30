var express = require("express");
var router  = express.Router();
var students = require("../models/post");
//var middleware = require("../middleware");


router.get("/", function(req, res){
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
router.post("/", function(req, res){
	students.create(req.body.student, function(err, newQuestion){
		if(err){
			res.render("posts/new");
		} else {
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
            res.render("posts/show", {student: foundStudent});
        }
    });
});




//EDIT ROUTE
router.get("/:id/edit", function(req, res){
    students.findById(req.params.id, function(err, foundStudent){
        if(err){
            res.redirect("/it_forum");
        } else {
            res.render("posts/edit", {student: foundStudent});
        }
    });
});

//UPDATE ROUTE 
router.put("/:id", function(req, res) {
    students.findByIdAndUpdate(req.params.id, req.body.student, function(err, updatedPost){
        if(err){
            res.redirect("/it_forum");
        } else {
            res.redirect("/it_forum/" + req.params.id);
        }
    });
});


// DELETE ROUTE
router.delete("/:id", function(req, res){
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
    // req.flash("error", "Please login first!");
    res.redirect("/login");
}

module.exports = router;
