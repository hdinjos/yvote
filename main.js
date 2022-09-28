import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import auth from "./routes/auth/index.js";
import candidate from "./routes/candidate/index.js";
import agenda from "./routes/agenda/index.js";
import vote from "./routes/vote/index.js";
import user from "./routes/user/index.js";
import major from "./routes/major/index.js";
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
app.use(major);
app.use(sessionCheck);
app.use(user);
app.use(vote);
app.use(candidate);
app.use(agenda);
app.listen(port, () => {
  console.log("listen port: " + port);
});
