import { DB_FILENAME } from "./common";
import express from "express";
import { PostsDb } from "./postsdb";

const port: number = 3000;

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const posts = new PostsDb(DB_FILENAME).getPosts();
  res.render("index", { posts });
});

app.get("/hide", (req, res) => {
  if (req.query.postId) {
    new PostsDb(DB_FILENAME).hidePost(req.query.postId as string);
    res.sendStatus(200).end();
  } else {
    res.sendStatus(500).end();
  }
});

app.listen(port, () => {
  console.log(`TypeScript with Express
       http://localhost:${port}/`);
});
