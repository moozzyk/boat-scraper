import { Database } from "sqlite3-async";
import { DB_FILENAME } from "./common";
import express from "express";

const port: number = 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { var: "My var" });
});

app.listen(port, () => {
  console.log(`TypeScript with Express
       http://localhost:${port}/`);
});
