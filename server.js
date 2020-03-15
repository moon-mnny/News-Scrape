var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var exphbs = require("express-handlebars");
var News = require("./model/newsModel");

var app = express();
app.engine("handlebars", exphbs());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));

//Config
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Check if it is connected
app.get("/ping", (req, res) => {
  res.send("pong");
});

//Get handlebars home
app.route("/").get(async (req, res) => {
  res.render("home");
});

//Get handlebars scrape, get the scrape cnn and append
app.route("/scrape").get(async (req, res) => {
  console.log(
    "\n******************************************\n" +
      "Every news from CNN Style \n" +
      "Headline,Summary,URL\n" +
      "grab the image's source URL." +
      "\n******************************************\n"
  );

  //scraping from CNN Style >> but still returning empty array
  axios.get("https://www.cnn.com/style").then(function(response) {
    var $ = cheerio.load(response.data);
    var result = [];
    $("section.ie.if.ai.dp.r.ig.ih.ii.ij.ik").each(function(i, element) {
      var title = $(element)
        .find("div.LayoutGrid__card")
        .find("a.CardBasic__title")
        .text();
      var link = $(element)
        .find("div.LayoutGrid__card")
        .find("a.CardBasic__title")
        .attr("href");
      var category = $(element)
        .find("div.LayoutGrid__card")
        .find("a.CardBasic__section")
        .text();
      var imgURL = $(element)
        .find("div.LayoutGrid__card")
        .find("img")
        .attr("src");
      result.push({
        title: title,
        category: category,
        link: link,
        imgURL: imgURL
      });
    });
    console.log(result);
    res.render("scrape", { result });
  });
});
app.listen(3000, () => {
  console.log("app listening at http://localhost:3000");
});
