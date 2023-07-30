const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { fileURLToPath } = require("url");
const { dirname } = require("path");

const app = express();
const PORT = 3000;

// Set EJS as the view engine and serve static files from the "public" directory
app.set("view engine", "ejs");
app.use(express.static("public"));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema for articles
const articleSchema = {
  title: String,
  content: String,
};

// Create a Mongoose model based on the schema
const Article = mongoose.model("Article", articleSchema);

// Root route - just sends a simple response

// Route to get all articles
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/articles", (req, res) => {
  Article.find({}).then((foundArticles) => {
    res.send(foundArticles);
  });
}); // Start the server and listen on the specified port
app.post("/articles", (req, res) => {
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save().then(() => {
      res.setHeader("Content-Type", "application/json");
      res.json({ message: "Successfully added a new article." });
    });
  } catch (err) {
    res.json({ message: err });
  }
});
app.delete("/articles", (req, res) => {
  try {
    Article.deleteMany({}).then(() => {
      res.setHeader("Content-Type", "application/json");
      res.json({ message: "Successfully deleted all articles." });
    });
  } catch (err) {
    res.json({ message: err });
  }
});
app.listen(PORT, () => {
  console.log(` app listening at http://localhost:${PORT}`);
});
