import * as BetterSqlite3 from "better-sqlite3";
import Database from "better-sqlite3";
import { Post } from "craigslist-automation/types";

export class PostsDb {
  private db: BetterSqlite3.Database;

  constructor(filename: string) {
    this.db = new Database(filename);
  }

  createPostsDb() {
    this.db.exec(`
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
      hide BOOLEAN NOT NULL DEFAULT 0,
      PRIMARY KEY (url, date));`);
  }

  insertPost(post: Post) {
    this.db
      .prepare(
        "INSERT OR IGNORE INTO Posts VALUES\
          ($url, $date, $title, $price, $currency, $description, $attributes, $images, $location, $ts, $hide);"
      )
      .run({
        url: post.url,
        date: (post.dateUpdated ?? post.datePosted ?? new Date()).getTime(),
        title: post.title,
        price: post.price,
        currency: post.currency,
        description: post.description,
        attributes: post.attributes ? JSON.stringify(post.attributes) : "NULL",
        images: post.images ? JSON.stringify(post.images) : "NULL",
        location: [post.city, post.state].join(", "),
        ts: Date.now(),
        hide: 0,
      });
  }

  lastPostDate(): Date {
    return new Date(
      this.db.prepare("SELECT max(date) from Posts;").pluck().get() ?? 0
    );
  }

  close() {
    this.db.close();
  }
}
