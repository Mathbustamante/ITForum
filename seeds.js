var mongoose = require("mongoose");
var students = require("./models/post");
var Comment   = require("./models/comment");


var data = [
    {
        name: "Matheus Bustamante", 
        email: "mbustama",
        id: "827248",
        question: "Wifi",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sagittis vehicula luctus. Sed metus nisi, auctor vitae nisl sed, tincidunt fringilla ex. Donec eros augue, cursus ac ante eu, fermentum dictum ligula. Donec ac nulla blandit, tempor sapien et, porttitor dolor. Sed at odio et augue mollis vehicula ut id quam. Praesent tincidunt gravida magna, venenatis varius tortor molestie a. Etiam vitae bibendum velit. Aliquam et ultrices tellus, nec tincidunt ante. Nulla sit amet odio placerat, fringilla lacus ac, elementum mi. Proin bibendum porta tortor sed condimentum."
    
    },
    {
       name: "Matheus Bustamante", 
        email: "mbustama",
        id: "827248",
        question: "Printer",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sagittis vehicula luctus. Sed metus nisi, auctor vitae nisl sed, tincidunt fringilla ex. Donec eros augue, cursus ac ante eu, fermentum dictum ligula. Donec ac nulla blandit, tempor sapien et, porttitor dolor. Sed at odio et augue mollis vehicula ut id quam. Praesent tincidunt gravida magna, venenatis varius tortor molestie a. Etiam vitae bibendum velit. Aliquam et ultrices tellus, nec tincidunt ante. Nulla sit amet odio placerat, fringilla lacus ac, elementum mi. Proin bibendum porta tortor sed condimentum."
    },
    {
        name: "Matheus Bustamante", 
        email: "mbustama",
        id: "827248",
        question: "Canvas",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sagittis vehicula luctus. Sed metus nisi, auctor vitae nisl sed, tincidunt fringilla ex. Donec eros augue, cursus ac ante eu, fermentum dictum ligula. Donec ac nulla blandit, tempor sapien et, porttitor dolor. Sed at odio et augue mollis vehicula ut id quam. Praesent tincidunt gravida magna, venenatis varius tortor molestie a. Etiam vitae bibendum velit. Aliquam et ultrices tellus, nec tincidunt ante. Nulla sit amet odio placerat, fringilla lacus ac, elementum mi. Proin bibendum porta tortor sed condimentum."
    }
]


function seedDB(){
   //Remove all campgrounds
   students.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed posts!");
         //add a few campgrounds
        data.forEach(function(seed){
            students.create(seed, function(err, post){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a post");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                post.comments.push(comment);
                                post.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;