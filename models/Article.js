var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new Schema object
// This is similar to a Sequelize model
var schema = new Schema({
  title: {
    type: String,
    trim: true,
    unique: true
  },
  link: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  userCreated: {
    type: Date,
    default: Date.now
  },
  lastUpdated: Date
});

// Export the Article model
module.exports = mongoose.model("Article", schema);
