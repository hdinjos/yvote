import express from "express";
import query from "../../databases/query.js";
import { sessionCheck, isSuperAdmin } from "../../middlewares/authorization.js";

const router = express.Router();

router.get("/majors", async (req, res) => {
  const majors = await query("SELECT * FROM majors");
  return res.json({ msg: "success", data: majors });
});

//middleware check private route
router.use(sessionCheck);

router.post("/majors", isSuperAdmin, async (req, res) => {
  const { name } = req.body;
  if (name) {
    await query("INSERT INTO majors(name) VALUES(?)", [name]);
    return res.json({ msg: "Create major success" });
  } else {
    return res.status(400).json({ msg: "Input is not valid" });
  }
});

router.put("/majors/:id", isSuperAdmin, async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (name) {
    const foundMajor = await query("SELECT * FROM majors WHERE id=?", [id]);
    if (foundMajor.length > 0) {
      await query("UPDATE majors SET name=? WHERE id=?", [name, id]);
      return res.json({ msg: "Update major success" });
    } else {
      return res.status(400).json({ msg: "Major not found" });
    }
  }
});

router.delete("/majors/:id", isSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const foundMajor = await query("SELECT * FROM majors WHERE id=?", [id]);
  if (foundMajor.length > 0) {
    await query("DELETE FROM majors WHERE id=?", [id]);
    return res.json({ msg: "Delete major success" });
  } else {
    return res.status(400).json({ msg: "Major not found" });
  }
});

export default router;
