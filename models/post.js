var mongoose = require("mongoose");

//Mongoose1/ Model config.
var it_forumSchema = new mongoose.Schema({
    name: String,
    email: String,
    id: String,
    question: String,
    description: String,
    created: { type : Date, default: Date.now },
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]

});

module.exports = mongoose.model("students", it_forumSchema);