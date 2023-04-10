const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(async function (req, res) {
    try {
      const articles = await Article.find();
      if (articles) {
        res.json(articles);
      } else {
        res.send("No articles currently in wikiDB.");
      }
    } catch (err) {
      res.send(err);
    }
  })
  .post(async function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    try {
      await newArticle.save();
      res.send("Successfully added a new article.");
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async function (req, res) {
    try {
      await Article.deleteMany();
      res.send("Successfully deleted all the articles in wikiDB.");
    } catch (err) {
      res.send(err);
    }
  });

app
  .route("/articles/:articleTitle")
  .get(async function (req, res) {
    const articleTitle = req.params.articleTitle;

    try {
      const article = await Article.findOne({ title: articleTitle });
      if (article) {
        res.json(article);
      } else {
        res.send("No article with that title found.");
      }
    } catch (err) {
      res.send(err);
    }
  })
  .patch(async function (req, res) {
    const articleTitle = req.params.articleTitle;

    try {
      await Article.updateOne(
        { title: articleTitle },
        { content: req.body.newContent }
      );
      res.send("Successfully updated selected article.");
    } catch (err) {
      res.send(err);
    }
  })
  .put(async function (req, res) {
    const articleTitle = req.params.articleTitle;

    try {
      await Article.findOneAndUpdate(
        { title: articleTitle },
        { content: req.body.newContent },
        { overwrite: true }
      );
      res.send("Successfully updated the content of the selected article.");
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async function (req, res) {
    const articleTitle = req.params.articleTitle;

    try {
      await Article.findOneAndDelete({ title: articleTitle });
      res.send("Successfully deleted selected article.");
    } catch (err) {
      res.send(err);
    }
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
