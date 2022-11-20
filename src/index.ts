import { forSaleCarsAndTrucks } from "craigslist-automation";
import { Database } from "sqlite3-async";

const DB_FILENAME = "/Users/moozzyk/tmp/testdb";

async function createDatabase(): Promise<void> {
  let db = new Database(DB_FILENAME);
  await db.open();
  await db.run(`
  CREATE TABLE IF NOT EXISTS Posts(
    url TEXT PRIMARY KEY,
    title TEXT,
    date_posted TIMESTAMP NOT NULL,
    date_updated TIMESTAMP,
    ts TIMESTAMP);`);
  await db.run(`
  CREATE TABLE IF NOT EXISTS PostVersions(
    url TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    title TEXT,
    price INTEGER,
    currency TEXT,
    description TEXT,
    attributes TEXT,
    images TEXT,
    location TEXT,
    PRIMARY KEY (url, date),
    FOREIGN KEY (url) REFERENCES Posts(url));`);
  await db.close();
}

(async () => {
  await createDatabase();
  let db = new Database(DB_FILENAME);
  await db.open();
  let insertPost = await db.prepare("INSERT INTO Posts VALUES(?, ?, ?, ?, ?);");
  let insertPostVersion = await db.prepare(
    "INSERT INTO PostVersions VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);"
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
      post.title,
      post.datePosted,
      post.dateUpdated ?? null,
      Date.now()
    );
    await insertPostVersion.run(
      post.url,
      post.dateUpdated ?? post.datePosted,
      post.title,
      post.price,
      post.currency,
      post.description,
      post.attributes ? JSON.stringify(post.attributes) : "NULL",
      post.images ? JSON.stringify(post.images) : "NULL",
      [post.city, post.state].join(", ")
    );
    if (value++ > 3) {
      break;
    }
  }
  await insertPost.finalize();
  await insertPostVersion.finalize();
  await db.close();
})();
