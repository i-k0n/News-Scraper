// Dependencies
var express = require("express");
var exphbs  = require('express-handlebars');
var axios = require("axios");
var cheerio = require("cheerio");

var logger = require("morgan");
var mongoose = require("mongoose");

// var Article = require("./articleModel.js");
// Initialize Express
var app = express();
var db = require("./models/index");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";

mongoose.connect(MONGODB_URI);
// Use morgan logger for logging requests
app.use(logger("dev"));

// Set up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Set up a static folder (public) for our web app
app.use(express.static("public"));



// Routes

app.get("/", function (req, res) {
    res.redirect("/articles");
});

app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.npr.org/sections/national/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // console.log(response.data)
      $("#main-section").find("article").each(function(i, element) {
        // console.log(element)
        var result = {};
        result.title = $(element).find(".title").text();
        result.link =  $(element).find(".title").children("a").attr("href");
        result.image = $(element).find("img").attr("src");
        result.summary = $(element).find(".teaser").text();
        console.log("result", result.image)
        db.Article.create(result).then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
          // If an error occurred, log it
            console.log(err);
          })    
      });
      res.send("Scrape Completed");
    });
  });

// home
app.get("/articles", function (req, res) {
  db.Article.find({}, function(err, docs) {
    // handlebars requires information to be passed as an object
    var obj = {
      articles: docs
    }
      res.render("index", obj);
    });
});

// single article
app.get("/article/:id", function (req, res) {
  db.Article.find({}, function(err, docs) {
    // handlebars requires information to be passed as an object
    var obj = {
      articles: docs
    }
      res.render("saved", obj);
    });
});

app.post("/article/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  
  // res.json(req.body) use first to check what the front end is sending back
  db.Note.create(req.body)
    .then(function(dbNote) {
      // res.json(dbNote);
      return db.Article.findOneAndUpdate({
        _id: req.params.id 
      }, { 
        note: dbNote._id 
      }, { 
        new: true 
      })
    }).then(function(dbArticle) {
      res.json(dbArticle)
    }).catch(function(err) {
      res.json(err);
    })
});


// save article
app.post("/article/:save/:id", function (req, res) {
  var save = req.params.save === "save" ? "true" : "false" 
  console.log(save)
  db.Article.findByIdAndUpdate(
    { _id: req.params.id }, { saved: save }, { new: true })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
})

// list of saved articles
app.get("/article/saved", function (req, res) {
  db.Article.find({}, function(err, docs) {
    // handlebars requires information to be passed as an object
    var obj = {
      articles: docs
    }
      res.render("saved", obj);
    });
})

// save note to article
app.post("/article/note/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      // res.json(dbNote);
      return db.Article.findOneAndUpdate({
        _id: req.params.id 
      }, { 
        note: dbNote._id 
      }, { 
        new: true 
      })
    }).then(function(dbArticle) {
      res.json(dbArticle)
    }).catch(function(err) {
      res.json(err);
    })
})

// // edit note
// app.put("/article/note/:id", function (req, res) {

// })

// delete a note
app.delete("/article/note/:id", function (req, res) {
  
})


// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
