var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var NewsSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: "Title is Required"
  },
  imgURL: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  }
});

var News = mongoose.model("News", NewsSchema);
module.exports = News;
