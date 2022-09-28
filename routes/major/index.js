import express from "express";
import query from "../../databases/query.js";

const router = express.Router();

router.get("/majors", async (req, res) => {
  const majors = await query("SELECT * FROM majors");
  return res.json({ msg: "success", data: majors });
});

export default router;
