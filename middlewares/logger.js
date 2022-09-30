import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const logger = (req, res, next) => {
  if (process.env.ENVIRONMENT === "DEV") {
    const log = morgan("dev");
    log(req, res, function (err) {
      return next();
    });
  } else {
    next();
  }
};

export default logger;
