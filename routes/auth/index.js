import express from "express";
import query from "../../databases/query.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../helper/jwt.js";
import strRandom from "../../helper/strRandom.js";
import mailer from "../../helper/mailer.js";
const router = express.Router();

const sendVerify = async (email) => {
  const randomText = strRandom();
  const checkEmail = await query(
    "SELECT email FROM email_verifications WHERE email=?",
    [email]
  );

  const mailBody = `
  <div style="text-align:center;">
    <div>
      <h4>Use code bellow to active your account</h4>
    </div>
    <div>
      <h2>${randomText}</h2>
    </div>
  </div>
  `;

  const optionSendMail = {
    to: email,
    subject: "Verification Account",
    text: mailBody,
    html: mailBody,
  };

  if (checkEmail.length > 0) {
    await mailer(optionSendMail);
    await query("UPDATE email_verifications SET verify_code=? WHERE email=?", [
      randomText,
      email,
    ]);
  } else {
    await mailer(optionSendMail);
    await query(
      "INSERT INTO email_verifications (email, verify_code) VALUES(?,?)",
      [email, randomText]
    );
  }
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const foundEmail = await query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (foundEmail.length > 0) {
      if (foundEmail[0]?.status) {
        const passwordData = foundEmail[0]?.password;
        const decrypt = await bcrypt.compare(password, passwordData);
        if (decrypt) {
          foundEmail[0].password = "";
          const token = generateToken(foundEmail[0]);
          return res.json({ msg: "success login", "access-token": token });
        } else {
          return res.status(400).json({ msg: "email/password not valid" });
        }
      } else {
        return res.status(400).json({
          msg: "The account need verification to actived, check your email",
        });
      }
    } else {
      return res.status(404).json({ msg: "email not regitered" });
    }
  } else {
    return res.status(400).json({ msg: "email/password not valid" });
  }
});

router.post("/register", async (req, res) => {
  const { email, fullname, password, major_id } = req.body;
  if (fullname && email && password && major_id) {
    try {
      await sendVerify(email);
      const hashPassword = await bcrypt.hash(password, 10);
      await query(
        "INSERT INTO users (email, password, name, major_id) VALUES(?,?,?,?)",
        [email, hashPassword, fullname, major_id]
      );
      return res
        .status(201)
        .json({ msg: "Register success, please check your email to actived" });
    } catch (err) {
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ msg: "Email already taken" });
      }
      return res.status(400).json({ msg: "Something wrong" });
    }
  } else {
    return res.status(400).json({ msg: "Input not valid" });
  }
});

router.post("/register/verify/resend", async (req, res) => {
  const { email } = req.body;
  if (email) {
    const foundEmail = await query("SELECT email FROM users WHERE email=?", [
      email,
    ]);
    if (foundEmail.length > 0) {
      await sendVerify(email);
      return res.json({
        msg: "Resend code to email success, please check your email",
      });
    } else {
      return res.status(400).json({ msg: "Email is not registered" });
    }
  } else {
    return res.status(400).json({ msg: "Email not valid" });
  }
});

router.post("/register/verify/activate", async (req, res) => {
  const { email, code } = req.body;
  if (email && code) {
    const checkCode = await query(
      "SELECT * FROM email_verifications WHERE email=? AND verify_code=?",
      [email, code]
    );
    if (checkCode.length > 0) {
      await query("UPDATE users SET status=? WHERE email=?", [1, email]);
      const getAccount = await query(
        "SELECT id, email, name, address, age, role_id, major_id, status FROM users WHERE email=?",
        [email]
      );
      const token = generateToken(getAccount[0]);
      await query("DELETE FROM email_verifications WHERE email=?", [email]);
      return res.json({
        msg: "Account is active",
        "access-token": token,
      });
    } else {
      return res.status(400).json({ msg: "Email/code not valid" });
    }
  } else {
    return res.status(400).json({ msg: "Input is not valid" });
  }
});

export default router;
