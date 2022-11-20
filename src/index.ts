import { Database } from "sqlite3-async";
import { DB_FILENAME } from "./common";
import express from "express";

const port: number = 3000;

const app: express.Application = express();

app.get("/", (req, res) => {
  res.send("TypeScript With Express");
});

app.listen(port, () => {
  console.log(`TypeScript with Express
       http://localhost:${port}/`);
});
