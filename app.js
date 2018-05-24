var express     = require("express");
    app         = express(),
    methodOverride = require("method-override"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");


mongoose.connect("mongodb://WITS:admin@ds231090.mlab.com:31090/it_forum");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

//Mongoose1/ Model config.
var it_forumSchema = new mongoose.Schema({
    name: String,
    email: String,
    id: String,
    question: String,
    description: String,
    created: { type : Date, default: Date.now }
});

var students = mongoose.model("students", it_forumSchema);

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
                res.render("index", {person: person, noMatch: noMatch});
            }
        });
    } else {

         students.find({}, function(err, person){
            if(err){
                console.log(err);
            } else  {
                res.render("index", {person: person});
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
			res.render("new", {student: student});
		}
	});
});

//CREATE ROUTE
app.post("/it_forum", function(req, res){
	students.create(req.body.student, function(err, newQuestion){
		if(err){
			res.render("new");
		} else {
			res.redirect("/it_forum");
		}
	});
});

//SHOW ROUTE
app.get("/it_forum/:id", function(req, res){
    students.findById(req.params.id, function(err, foundStudent){
        if(err){
            res.redirect("new");
        } else {
            res.render("show", {student: foundStudent});
        }
    });
});




//EDIT ROUTE
app.get("/it_forum/:id/edit", function(req, res){
    students.findById(req.params.id, function(err, foundStudent){
        if(err){
            res.redirect("/it_forum");
        } else {
            res.render("edit", {student: foundStudent});
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

//DELETE ROUTE
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


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



app.listen(3000, function(){
	console.log("Server has started on port 3000");
});




	

