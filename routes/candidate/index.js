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

router.get("/candidates/:id", isOriganizer, async (req, res) => {
  const { id } = req.params;
  const { major_id } = req.user;

  if (id) {
    const foundCandidate = await query(
      "SELECT A.id, B.name, B.address, A.motto, B.major_id FROM candidates as A INNER JOIN users as B ON A.user_id=B.id WHERE A.id=?",
      [id]
    );
    if (foundCandidate.length > 0) {
      if (foundCandidate[0].major_id === major_id) {
        return res.json({ msg: "success", data: foundCandidate[0] });
      } else {
        return res.status(400).json({ msg: "Candidate not found" });
      }
    } else {
      return res.status(400).json({ msg: "Candidate not found" });
    }
  } else {
    return res.status(400).json({ msg: "Candidate not found" });
  }
});

router.post("/candidates", isOriganizer, async (req, res) => {
  const { major_id } = req.user;
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
        const user = await query("SELECT major_id FROM users WHERE id=?", [
          user_id,
        ]);
        if (user.length > 0 && user[0].major_id === major_id) {
          await query(
            "INSERT INTO candidates(user_id, motto, agenda_id) VALUES(?,?,?)",
            [user_id, motto, agenda_id]
          );
          return res.status(201).json({ msg: "Create candidate success" });
        } else {
          return res
            .status(400)
            .json({ msg: "User as candidate is not same major" });
        }
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
    const { major_id } = req.user;
    const foundCandidate = await query(
      "SELECT agenda_id, major_id FROM candidates as A INNER JOIN agendas as B ON A.agenda_id=B.id WHERE A.id=?",
      [id]
    );
    if (foundCandidate.length > 0) {
      if (foundCandidate[0].major_id === major_id) {
        if (user_id && motto) {
          const user = await query("SELECT major_id FROM users WHERE id=?", [
            user_id,
          ]);
          if (user.length > 0) {
            if (user[0].major_id === major_id) {
              await query(
                "UPDATE candidates SET user_id=?, motto=? WHERE id=?",
                [user_id, motto, id]
              );
              await query("DELETE FROM agenda_users WHERE candidate_id=?", [
                id,
              ]);
              return res.json({ msg: "Update candidate success" });
            } else {
              return res.status(400).json({ msg: "User is not same major" });
            }
          } else {
            return res.status(400).json({ msg: "User is not valid" });
          }
        } else {
          return res.status(400).json({ msg: "Invalid Input" });
        }
      } else {
        return res.status(400).json({ msg: "Candidate is not same major" });
      }
    } else {
      return res.status(404).json({ msg: "Candidate not found" });
    }
  } catch (err) {
    return res.status(400).json({ msg: "User is not valid" });
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
