var mongoose = require("mongoose");
//POST - title + content
var quoteSchema = new mongoose.Schema({
	content: String, 
	author: String,
	color: String
}); 

//You need to declare what you are sending out...
module.exports = mongoose.model("Quote", quoteSchema);
