// Dependencies
var express = require("express");
var exphbs  = require('express-handlebars');
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Set up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');
// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "news";
var collections = ["articles"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
// 1. At the root path, send a simple hello world message to the browser
app.get("/", function(req, res) {
    db.articles.find({}, function(err, found) {
        if (err) {
            console.log(err);
        }
        // Otherwise, send the result of this query to the browser
            else {
            res.render("index", found);
        }
    })
});

// 2. At the "/all" path, display every entry in the animals collection
app.get("/all", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.articles.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

// 3. At the "/name" path, display every entry in the animals collection, sorted by name
app.get("/name", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything,
  // but this time, sort it by name (1 means ascending order)
  db.articles.find().sort({ name: 1 }, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

app.get("/scrape", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything,
    // but this time, sort it by weight (-1 means descending order)
      axios.get("https://www.reuters.com/news/us").then(function(response) {
        res.send("scraping intiated");
        var $ = cheerio.load(response.data);
        $("h2.FeedItemHeadline_headline > a").each(function(i, headline) {
          var title = $(headline).text()
          var link = $(headline).attr("href")
          if (title && link) {
            db.articles.insert({
              title, 
              link
            }), function (err) {
              console.log(err)
            }
          } else {
            console.log("inserted instead")
          }
        })
      })
  });

// Set the app to listen on port 3000
app.listen(8080, function() {
  console.log("App running on port 8080!");
});
