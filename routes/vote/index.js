import express from "express";
import query from "../../databases/query.js";
import {
  isOriganizer,
  isChoice,
  isVote,
} from "../../middlewares/authorization.js";

const router = express.Router();

router.get("/votes", isOriganizer, async (req, res) => {
  const candidates = await query(
    "SELECT A.id, name, motto, user_id, agenda_id FROM candidates as A INNER JOIN users as B ON A.user_id=B.id"
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

  return res.json({ msg: "success", data: voteResults });
});

router.post("/votes", isChoice, isVote, async (req, res) => {
  const { candidate_id } = req.body;
  const { id, major_id } = req.user;

  if (candidate_id) {
    try {
      const user = await query(
        "SELECT major_id FROM candidates as A INNER JOIN users as B ON A.user_id=B.id WHERE A.id=?",
        [candidate_id]
      );
      if (user.length > 0 && user[0].major_id === major_id) {
        await query("INSERT INTO votes(candidate_id) VALUES(?)", [
          candidate_id,
        ]);
        await query("UPDATE users SET is_vote=? WHERE id=?", [1, id]);
        return res.status(201).json({ msg: "Vote is success" });
      } else {
        return res.status(401).json({ msg: "Candidate is not in your major" });
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
    return res.status(400).json({ msg: "Vote is failed" });
  }
});

export default router;
