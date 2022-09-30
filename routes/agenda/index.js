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

router.get("/agendas/:id", async (req, res) => {
  const { id } = req.params;
  const { major_id } = req.user;
  const agenda = await query(
    "SELECT * FROM agendas WHERE id=? AND major_id=?",
    [id, major_id]
  );
  const candidates = await query(
    `SELECT A.id, name, motto, user_id, agenda_id
    FROM candidates as A
    INNER JOIN users as B
    ON A.user_id=B.id
    WHERE agenda_id=? AND major_id=?`,
    [id, major_id]
  );

  let voteResults = [];
  for (let i = 0; i < candidates.length; i++) {
    let id_candidate = candidates[i].id;
    const vote = await query(
      "SELECT COUNT(id) as votes_count FROM votes WHERE candidate_id=?",
      [id_candidate]
    );
    const mergerData = { ...candidates[i], ...vote[0] };
    voteResults.push(mergerData);
  }

  return res.json({
    msg: "success",
    data: {
      agenda: agenda.length > 0 ? agenda[0] : null,
      candidates: voteResults,
    },
  });
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
    return res.status(404).json({ msg: "Agenda not found" });
  }
});

export default router;
