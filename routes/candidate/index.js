import express from "express";
import query from "../../databases/query.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../helper/jwt.js";
const router = express.Router();

router.get("/candidates", async (req, res) => {
  const candidate = await query("SELECT * FROM candidates");
  console.log("userrrrr", req.user);
  return res.json({ msg: "success", data: {} });
});

export default router;
