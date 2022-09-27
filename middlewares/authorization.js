import { verifyToken } from "../helper/jwt.js";
import query from "../databases/query.js";

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

const isOriganizer = (req, res, next) => {
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

const isChoice = async (req, res, next) => {
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

const allRole = (req, res, next) => {
  if (req.user) {
    const { role_id } = req.user;
    if (role_id === 1 || role_id === 2) {
      next();
    } else {
      return res.status(401).json({ msg: "Not allowed" });
    }
  } else {
    return res.status(401).json({ msg: "Not allowed" });
  }
  allRole;
};

const isVote = async (req, res, next) => {
  const { id } = req.user;
  const user = await query("SELECT is_vote FROM users WHERE id=?", [id]);
  if (user.length > 0 && user[0].is_vote) {
    return res.status(401).json({ msg: "Not allowed, you have voted" });
  } else {
    next();
  }
};

export { sessionCheck, isOriganizer, isChoice, allRole, isVote };
