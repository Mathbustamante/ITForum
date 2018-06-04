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
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               post.comments.push(comment);
               post.save();
               req.flash("success", "Successfully added comment");
               res.redirect('/it_forum/' + post._id);
           }
        });
       }
   });
});

router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {student_id: req.params.id, comment: foundComment});
      }
   });
});

// // COMMENT UPDATE
router.put("/:comment_id", checkCommentdOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/it_forum/" + req.params.id );
      }
   });
});

// // COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentdOwnership,  function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
          req.flash("success", "Comment deleted");
          res.redirect("/it_forum/" + req.params.id);
       }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

function checkCommentdOwnership(req, res, next){
    if(req.isAuthenticated()){
             Comment.findById(req.params.comment_id, function(err, foundComment) {
                 if(err){
                    res.redirect("back");
                 } else {
                     if(foundComment.author.id.equals(req.user._id)){
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