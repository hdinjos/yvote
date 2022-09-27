import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import query from "./databases/query.js";
import auth from "./routes/auth/index.js";
import candidate from "./routes/candidate/index.js";
import { sessionCheck } from "./middlewares/authorization.js";
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

app.get("/", async (req, res) => {
  res.json({
    msg: "Hello world",
    endpoint: "wellcome to our server",
  });
});

app.use(auth);
app.use(sessionCheck);
app.use(candidate);
app.listen(port, () => {
  console.log("listen port: " + port);
});
