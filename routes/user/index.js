import express from "express";
import query from "../../databases/query.js";
import { isOriganizer } from "../../middlewares/authorization.js";

const router = express.Router();

router.use(isOriganizer);

router.get("/users", async (req, res) => {
  const { major_id } = req.user;
  const users = await query(
    "SELECT id, name, major_id FROM users WHERE major_id=? AND role_id=?",
    [major_id, 2]
  );
  return res.json({ msg: "success", data: users });
});

export default router;
