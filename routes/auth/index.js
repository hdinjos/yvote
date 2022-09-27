import express from "express";
import query from "../../databases/query.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../helper/jwt.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const foundEmail = await query(
      "SELECT id, email, password , name, age, address, role_id, major_id FROM users WHERE email=?",
      [email]
    );
    console.log(foundEmail);
    if (foundEmail.length > 0) {
      const passwordData = foundEmail[0]?.password;
      const decrypt = await bcrypt.compare(password, passwordData);
      if (decrypt) {
        foundEmail[0].password = "";
        const token = generateToken(foundEmail[0]);
        return res.json({ msg: "success login", "acccess-token": token });
      } else {
        return res.status(400).json({ msg: "email/password not valid" });
      }
    } else {
      return res.status(404).json({ msg: "email not regitered" });
    }
  } else {
    return res.status(400).json({ msg: "email/password not valid" });
  }
});

export default router;
