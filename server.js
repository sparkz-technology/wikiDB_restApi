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
////////////// Request Targetting All Articles ///////////////////////
app
  .route("/articles")
  // app.get("/articles"); // Start the server and listen on the specified port
  .get((req, res) => {
    Article.find({}).then((foundArticles) => {
      res.send(foundArticles);
    });
  })
  // app.post("/articles");
  .post((req, res) => {
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
  })
  // app.delete("/articles");
  .delete((req, res) => {
    try {
      Article.deleteMany({}).then(() => {
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Successfully deleted all articles." });
      });
    } catch (err) {
      res.json({ message: err });
    }
  });
////////////// Request Targetting A Specific Article ///////////////////////
app
  .route("/articles/:articleTitle")
  // app.get("/articles/:articleTitle");
  .get((req, res) => {
    try {
      Article.findOne({ title: req.params.articleTitle }).then(
        (foundArticle) => {
          if (foundArticle) {
            res.setHeader("Content-Type", "application/json");
            res.json(foundArticle);
          } else {
            res.setHeader("Content-Type", "application/json");
            res.json({ message: "No article matching that title was found." });
          }
        }
      );
    } catch (err) {
      res.json({ message: err });
    }
  })
  // app.put("/articles/:articleTitle");
  .put((req, res) => {
    try {
      Article.update(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true }
      ).then(() => {
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Successfully updated article." });
      });
    } catch (err) {
      res.json({ message: err });
    }
  })
  // app.patch("/articles/:articleTitle");
  .patch((req, res) => {
    try {
      Article.update(
        { title: req.params.articleTitle },
        { $set: req.body }
      ).then(() => {
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Successfully updated article." });
      });
    } catch (err) {
      res.json({ message: err });
    }
  })
  // app.delete("/articles/:articleTitle");
  .delete((req, res) => {
    try {
      Article.deleteOne({ title: req.params.articleTitle }).then(() => {
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Successfully deleted article." });
      });
    } catch (err) {
      res.json({ message: err });
    }
  });
app.listen(PORT, () => {
  console.log(` app listening at http://localhost:${PORT}`);
});
