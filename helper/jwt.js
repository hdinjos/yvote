import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET);
};

export { generateToken, verifyToken };
