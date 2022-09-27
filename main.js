import express from "express";
import dotenv from "dotenv";
import query from "./databases/query.js";
dotenv.config();

const app = express();

const port = 3000;

app.get("/", async (req, res) => {
  const result = await query("SELECT * from users");
  console.log(result);
  res.send("hello world");
});

app.listen(port, () => {
  console.log("listen port: " + port);
});
