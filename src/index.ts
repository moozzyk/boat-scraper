import { getDatabasePath } from "./common";
import express from "express";
import { PostsDb } from "./postsdb";

const port: number = 3000;

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

function groupPosts(posts: any[]): Map<string, any[]> {
  const groupedPosts = new Map<string, any[]>();
  const titleToUrlMap = new Map<string, string>();
  posts.forEach((post) => {
    if (groupedPosts.has(post.url)) {
      groupedPosts.get(post.url)?.push(post);
    } else {
      if (titleToUrlMap.has(post.title)) {
        const url = titleToUrlMap.get(post.title)!;
        groupedPosts.get(url)?.push(post);
      } else {
        groupedPosts.set(post.url, [post]);
        titleToUrlMap.set(post.title, post.url);
      }
    }
  });
  return groupedPosts;
}

app.get("/", (req, res) => {
  const posts = groupPosts(new PostsDb(getDatabasePath()).getPosts());
  res.render("index", { posts: posts.values() });
});

app.get("/hide", (req, res) => {
  if (req.query.postId) {
    new PostsDb(getDatabasePath()).hidePost(req.query.postId as string);
    res.sendStatus(200).end();
  } else {
    res.sendStatus(500).end();
  }
});

app.listen(port, () => {
  console.log(`TypeScript with Express
       http://localhost:${port}/`);
});
