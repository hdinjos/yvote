import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
// import logger from "./middlewares/logger.js";
import auth from "./routes/auth/index.js";
import candidate from "./routes/candidate/index.js";
import agenda from "./routes/agenda/index.js";
import vote from "./routes/vote/index.js";
import user from "./routes/user/index.js";
import major from "./routes/major/index.js";
dotenv.config();

const app = express();
const port = process.env.PORT_SERVER || 3000;

// app.use(logger);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//public route
app.get("/", async (req, res) => {
  res.json({
    msg: "Hello world",
    endpoint: "wellcome to our server",
  });
});

app.use(auth);
app.use(major);

//private route
app.use(user);
app.use(vote);
app.use(candidate);
app.use(agenda);

app.listen(port, () => {
  console.log("server listen port: " + port);
});
