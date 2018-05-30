var express = require("express");
var router  = express.Router({mergeParams: true});
var students = require("../models/post");
var Comment = require("../models/comment");

//=====================
//COMMENTS ROUTES
//=====================

router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    students.findById(req.params.id, function(err, foundStudent){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {student: foundStudent});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "Please login first!");
    res.redirect("/login");
}

module.exports = router;