var express = require("express"),
	app = express(), 
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"), 
	methodOverride = require("method-override"), 
	expressSanitizer = require("express-sanitizer"),
	request = require("request"), 
	Quote = require("./models/quote"),
	fs = require('fs'),
	puppeteer = require('puppeteer');
	//quote = require("")
	//quoteGenerator = require('random-quote-generator');

app.set("view engine", "ejs"); 
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/quotes", {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.get("/", function(req,res){
	res.render("landing");
});
app.get("/quotes", function(req,res){
	Quote.find({}, function(err, allQuotes){
		if(err){
			console.log(err); 
		} else{
			res.render("index", {quotes: allQuotes}); 
		}
	}); 
	
});

app.get("/quotes/new", function(req,res){
	var quote = "hi"; 
	const url = "https://api.quotable.io/random";
	request(url, function(error, response, body){
		var data = JSON.parse(body); 
		if(data.Response === "False"){
			res.send("error: " + data.Error); 
		}
		else if(!error && response.statusCode == 200){
			res.render("new", {data: data});	
		}	
	});

}); 

app.post("/quotes", function(req, res){
	var content = req.body.content;
	var author = req.body.author;
	var color = req.body.color; 
	var newQuote = {content: content, author: author, color: color}
	
	Quote.create(newQuote, function(err, newlyCreated){
		if(err){
			console.log(err); //change later
		} else{
			res.redirect("/quotes");
		}
	});	
});

app.get("/quotes/:id", function(req,res){
	Quote.findById(req.params.id, function(err, quote){
		if(err){
			console.log(err); 
		} else{
			res.render("show", {data: quote}); 
		}
	}); 
}); 

app.get("/quotes/:id/edit", function(req,res) {
	Quote.findById(req.params.id, function(err, foundQuote){
		if(err){
			res.redirect("/quotes");
		}else{
			res.render("edit", {data: foundQuote}); 
		}
	});
}); 

app.put("/quotes/:id", function(req,res){
	//Blog.findByIDAndUpdate(id, newData, callback)
	//data is what you called it in form have to??
	//req.body.blog.body = req.sanitize(req.body.blog.body); 
	Quote.findByIdAndUpdate(req.params.id, req.body.quote, function(err, foundQuote){
		if(err){
			res.redirect("/quotes");
		}else{
			res.redirect("/quotes/" + req.params.id); 
		}
	});
});

app.get("/iframe", function(req,res){
	Quote.find({}, function(err, allQuotes){
		if(err){
			console.log(err); 
		} else{
			res.render("iframeIndex", {quotes: allQuotes}); 
		}
	}); 
	
});
app.delete("/quotes/:id", function(req,res){
	Quote.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/quotes");
		} else{
			res.redirect("/quotes");
		}
	})
});

// app.get("/quotes/screenshot/:id", function(req,res){ 
// 	// var myUrl = "https://karyna.run-us-west2.goorm.io" + req.url; 
// 	// console.log(myUrl);
// 	// Quote.findById(req.params.id, function(err, foundQuote){
// 	// 	if(err){
// 	// 		res.redirect("/quotes");
// 	// 	}else{
// 	// 		res.render("screenshot", {data: foundQuote}); 
// 	//  }
// 	res.send("hello world");
// });
app.get("/quotes/screenshot/:id", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto("http://google.com");
    const image = await page.screenshot({fullPage : true});
    await browser.close();
    response.set('Content-Type', 'image/png');
    response.send(image);
  } catch (error) {
    console.log(error);
  }
});

app.get("/*", function(req,res){
	res.redirect("/quotes");
});

app.listen(3000, function(){
	console.log("***server is listening***");
});