import express from "express";
import query from "../../databases/query.js";
import { isOriganizer, allRole } from "../../middlewares/authorization.js";

const router = express.Router();

router.get("/candidates", allRole, async (req, res) => {
  const { agenda_id } = req.query;
  const { major_id } = req.user;
  if (!agenda_id) {
    const candidate = await query(
      "SELECT A.id, email, name, address, motto FROM candidates as A INNER JOIN users as B ON A.user_id = B.id WHERE major_id=?",
      [major_id]
    );
    return res.json({ msg: "success", data: candidate });
  } else {
    const candidate = await query(
      "SELECT A.id, email, name, address, motto FROM candidates as A INNER JOIN users as B ON A.user_id = B.id WHERE major_id=? AND agenda_id=?",
      [major_id, agenda_id]
    );
    return res.json({ msg: "success", data: candidate });
  }
});

router.post("/candidates", isOriganizer, async (req, res) => {
  const { user_id, motto, agenda_id } = req.body;
  if (user_id && motto && agenda_id) {
    const existCandidate = await query(
      "SELECT id FROM candidates WHERE user_id=?",
      [user_id]
    );
    if (existCandidate.length > 0) {
      return res.status(400).json({
        msg: "The user already registered as candidate, choice another",
      });
    } else {
      try {
        await query(
          "INSERT INTO candidates(user_id, motto, agenda_id) VALUES(?,?,?)",
          [user_id, motto, agenda_id]
        );
        return res.status(201).json({ msg: "create candidate success" });
      } catch (err) {
        if (err?.code === "ER_NO_REFERENCED_ROW_2") {
          return res
            .status(400)
            .json({ msg: "User/agenda is not registered, use another" });
        } else {
          return res.status(403).json({ msg: "Something wrong" });
        }
      }
    }
  } else {
    return res.status(400).json({ msg: "create candidate failed" });
  }
});

router.put("/candidates/:id", isOriganizer, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, motto } = req.body;
    const foundCandidate = await query("SELECT * FROM candidates WHERE id=?", [
      id,
    ]);
    if (foundCandidate.length > 0) {
      if (user_id && motto) {
        await query("UPDATE candidates SET user_id=?, motto=?", [
          user_id,
          motto,
        ]);
        return res.json({ msg: "Update candidate success" });
      } else {
        return res.status(400).json({ msg: "Invalid Input" });
      }
    } else {
      return res.status(404).json({ msg: "Candidate not found" });
    }
  } catch (err) {
    return res.status(404).json({ msg: "Candidate not found" });
  }
});

router.delete("/candidates/:id", isOriganizer, async (req, res) => {
  try {
    const { id } = req.params;
    const removeCandidate = await query("DELETE FROM candidates WHERE id=?", [
      id,
    ]);
    if (removeCandidate?.affectedRows) {
      return res.json({ msg: "Delete candidate success" });
    } else {
      return res.status(404).json({ msg: "Candidate not found" });
    }
  } catch (err) {
    return res.status(404).json({ msg: "Candidate not found" });
  }
});

export default router;
