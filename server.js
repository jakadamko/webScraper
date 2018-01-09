//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var Handlebars = require("handlebars");

//scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Require allmodels
// var db = require("./models");
var Article = require("./models/Article.js");
var Note = require("./models/Notes.js");

var port = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Requiring Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/myapp", {
	useMongoClient: true
});

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
	console.log("Mongoose connection successful.");
});
///////////////////////////////////////////////

// Routes
// root path
app.get("/", function (req, res) {
	// Grab every doc in the Articles array
	Article.find({}, function (error, doc) {
		// Log any errors
		if (error) {
			console.log(error);
		}
		// Or send the doc to the browser as a json object
		else {
			//res.json(doc);
			res.render("index", { articles: doc });
		}
	});
});

// A GET request to scrape the reddit website
app.get("/scrape", function (req, res) {
	// First, we grab the body of the html with request
	request("http://reddit.com/r/Ripple/", function (error, response, html) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(html);
		// Now, we grab every h2 within an article tag, and do the following:
		$("p.title").each(function (i, element) {
			// Save an empty result object
			var result = {};

			// Add the text and href of every link, and save them as properties of the result object
			result.title = $(this)
				.text();
			result.link = $(this)
				.children()
				.attr("href");

			// Create a new Article using the `result` object built from scraping
			var entry = new Article(result);

			//save to db
			entry.save(function (err, doc) {
				// Log errors
				if (err) {
					console.log(err);
				}
				// else log doc
				else {
					console.log(doc);
				}
			});

		});
	});
	// Tell the browser that we finished scraping the text
	// res.send("Scrape Complete");
	res.redirect("/");
});
//////////////////////////////////////////////

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {

	// Grab every document in the Articles collection
	// db.Article
	// .find({})
	// .then(function(dbArticle) {
	Article.find({}, function (error, doc) {
		// If an error occurred, send it to the client
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
	// Using the id passed in the id parameter, prepare a query that finds the matching one in our db.
	Article
		.findOne({ "_id": req.params.id })
		// .. and populate all of the notes associated with it
		.populate("note")
		.then(function(doc) {
			// If we were able to successfully find an Article with the given id, send it back to the client
			res.json(doc);
		})
		.catch(function (err) {
			// If an error occurred, send it to the client
			res.json(err);
		});
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
	// Create a new note and pass the req.body to the entry
	var newNote = new Note(req.body);

	// And save the new note the db
	newNote.save(function (error, doc) {
		// Log any errors
		if (error) {
			console.log(error);
		}
		// Otherwise
		else {
			// Use the article id to find and update it's note
			Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
				// Execute the above query
				.exec(function (err, doc) {
					// Log any errors
					if (err) {
						console.log(err);
					}
					else {
						// Or send the document to the browser
						res.send(doc);
					}
				});
		}
	});
});

// Start the server
app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");
});