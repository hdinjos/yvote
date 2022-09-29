import express from "express";
import query from "../../databases/query.js";
import { isChoice, isVote } from "../../middlewares/authorization.js";

const router = express.Router();

router.post("/votes", isChoice, async (req, res) => {
  const { candidate_id, agenda_id } = req.body;
  const { id, major_id } = req.user;

  if (candidate_id && agenda_id) {
    try {
      const agenda_users = await query(
        "SELECT * FROM agenda_users WHERE agenda_id=? AND user_id=?",
        [agenda_id, id]
      );
      if (agenda_users.length > 0) {
        return res.status(401).json({ msg: "Not allowed, you have voted" });
      } else {
        const candidate = await query(
          "SELECT agenda_id FROM candidates WHERE id=?",
          [candidate_id]
        );

        if (candidate.length > 0 && candidate[0].agenda_id + "" === agenda_id) {
          const user = await query(
            "SELECT major_id FROM candidates as A INNER JOIN users as B ON A.user_id=B.id WHERE A.id=?",
            [candidate_id]
          );
          if (user.length > 0 && user[0].major_id === major_id) {
            await query("INSERT INTO votes(candidate_id) VALUES(?)", [
              candidate_id,
            ]);
            await query(
              "INSERT INTO agenda_users(agenda_id, user_id) VALUES(?,?)",
              [agenda_id, id]
            );
            return res.status(201).json({ msg: "Vote is success" });
          } else {
            return res
              .status(401)
              .json({ msg: "Candidate is not in your major" });
          }
        } else {
          return res
            .status(400)
            .json({ msg: "Agenda is not match with candidate" });
        }
      }
    } catch (err) {
      if (err?.code === "ER_NO_REFERENCED_ROW_2") {
        return res
          .status(400)
          .json({ msg: "Candidate is not registered, use another" });
      } else {
        console.log(err);
        return res.status(403).json({ msg: "Something wrong" });
      }
    }
  } else {
    return res.status(400).json({ msg: "Input not valid" });
  }
});

export default router;
