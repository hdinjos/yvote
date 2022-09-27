import { verifyToken } from "../helper/jwt.js";

const sessionCheck = (req, res, next) => {
  const tokenBearer = req.get("Authorization");

  if (tokenBearer && tokenBearer.includes("Bearer ")) {
    try {
      const token = tokenBearer.replace("Bearer ", "");
      const user = verifyToken(token);
      req.user = user;
      next();
    } catch (err) {
      return res.status(408).json({ msg: "Token is expired" });
    }
  } else {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

const roleCheck = () => {};

export { sessionCheck, roleCheck };
