var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var schema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String
});

// Export the Article model
module.exports = mongoose.model("Note", schema);