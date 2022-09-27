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

const isPanitia = (req, res, next) => {
  if (req.user) {
    const { role_id } = req.user;
    if (role_id === 1) {
      next();
    } else {
      return res.status(401).json({ msg: "Not allowed" });
    }
  } else {
    return res.status(401).json({ msg: "Not allowed" });
  }
};

const isChoice = (req, res, next) => {
  if (req.user) {
    const { role_id } = req.user;
    if (role_id === 2) {
      next();
    } else {
      return res.status(401).json({ msg: "Not allowed" });
    }
  } else {
    return res.status(401).json({ msg: "Not allowed" });
  }
};

export { sessionCheck, isPanitia, isChoice };
