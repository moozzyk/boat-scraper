import { forSaleCarsAndTrucks } from "craigslist-automation";
import { Database } from "sqlite3-async";
import { DB_FILENAME } from "./common";

async function createDatabase(): Promise<void> {
  let db = new Database(DB_FILENAME);
  await db.open();
  await db.run(`
  CREATE TABLE IF NOT EXISTS Posts(
    url TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    title TEXT,
    price INTEGER,
    currency TEXT,
    description TEXT,
    attributes TEXT,
    images TEXT,
    location TEXT,
    ts TIMESTAMP,
    PRIMARY KEY (url, date),
    FOREIGN KEY (url) REFERENCES Posts(url));`);
  await db.close();
}

(async () => {
  await createDatabase();
  let db = new Database(DB_FILENAME);
  await db.open();
  let insertPost = await db.prepare(
    "INSERT INTO Posts VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
  );
  let value = 0;
  for await (let galleryPost of forSaleCarsAndTrucks("seattle", {
    query: "blazer k5",
  })) {
    console.log(galleryPost);
    const post = await galleryPost.getPost();
    console.log(post);
    await insertPost.run(
      post.url,
      post.dateUpdated ?? post.datePosted,
      post.title,
      post.price,
      post.currency,
      post.description,
      post.attributes ? JSON.stringify(post.attributes) : "NULL",
      post.images ? JSON.stringify(post.images) : "NULL",
      [post.city, post.state].join(", "),
      Date.now()
    );
    if (value++ > 3) {
      break;
    }
  }
  await insertPost.finalize();
  await db.close();
})();
