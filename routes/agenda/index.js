import express from "express";
import query from "../../databases/query.js";
import { isOriganizer } from "../../middlewares/authorization.js";

const router = express.Router();

router.use(isOriganizer);

router.get("/agendas", async (req, res) => {
  const { major_id } = req.user;
  const agendas = await query(
    "SELECT id, title, date FROM agendas WHERE major_id=?",
    [major_id]
  );
  return res.json({ msg: "success", data: agendas });
});

router.post("/agendas", async (req, res) => {
  const { major_id } = req.user;
  const { title } = req.body;
  if (title) {
    try {
      await query("INSERT INTO agendas(title, major_id) VALUES(?,?)", [
        title,
        major_id,
      ]);
      return res.status(201).json({ msg: "Create agendas success" });
    } catch (err) {
      return res.status(403).json({ msg: "Something wrong" });
    }
  } else {
    return res.status(400).json({ msg: "Create agendas success" });
  }
});

router.delete("/agendas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removeAgenda = await query("DELETE FROM agendas WHERE id=?", [id]);
    if (removeAgenda?.affectedRows) {
      return res.json({ msg: "Delete agenda success" });
    } else {
      return res.status(404).json({ msg: "Agenda not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "Agenda not found" });
  }
});

export default router;
