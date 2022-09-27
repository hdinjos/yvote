import express from "express";
import query from "../../databases/query.js";
import {
  isOriganizer,
  isChoice,
  isVote,
} from "../../middlewares/authorization.js";

const router = express.Router();

router.get("/votes", isOriganizer, async (req, res) => {
  const vote = await query(
    "SELECT A.id, B.user_id FROM votes as A INNER JOIN candidates as B ON A.candidate_id = B.id"
  );
  console.log(vote);
  return res.json({ msg: "success", data: vote });
});

router.post("/votes", isChoice, isVote, async (req, res) => {
  const { candidate_id } = req.body;
  const { id } = req.user;

  if (candidate_id) {
    try {
      await query("INSERT INTO votes(candidate_id) VALUES(?)", [candidate_id]);
      await query("UPDATE users SET is_vote=? WHERE id=?", [1, id]);
      return res.status(201).json({ msg: "Vote is success" });
    } catch (err) {
      console.log(err);
      if (err?.code === "ER_NO_REFERENCED_ROW_2") {
        return res
          .status(400)
          .json({ msg: "Candidate is not registered, use another" });
      } else {
        return res.status(403).json({ msg: "Something wrong" });
      }
    }
  } else {
    return res.status(400).json({ msg: "Vote is failed" });
  }
});

// router.delete("/candidates/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const removeCandidate = await query("DELETE FROM candidates WHERE id=?", [
//       id,
//     ]);
//     if (removeCandidate?.affectedRows) {
//       return res.json({ msg: "Delete candidate success" });
//     } else {
//       return res.status(404).json({ msg: "Candidate not found" });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(404).json({ msg: "Candidate not found" });
//   }
// });

export default router;
