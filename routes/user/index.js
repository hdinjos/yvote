import express from "express";
import bcrypt from "bcryptjs";
import query from "../../databases/query.js";
import { isOriganizer, isSuperAdmin } from "../../middlewares/authorization.js";

const router = express.Router();

router.get("/users", isOriganizer, async (req, res) => {
  const { major_id } = req.user;
  if (major_id) {
    const users = await query(
      "SELECT id, name, major_id FROM users WHERE major_id=? AND role_id=?",
      [major_id, 2]
    );
    return res.json({ msg: "success", data: users });
  } else {
    const users = await query(
      "SELECT id, email, name, address, age, major_id FROM users WHERE role_id=?",
      [1]
    );
    return res.json({ msg: "success", data: users });
  }
});

router.post("/users", isSuperAdmin, async (req, res) => {
  try {
    const { email, password, name, address, age, major_id } = req.body;
    if (email && password && name && address && age && major_id) {
      const hashPassword = await bcrypt.hash(password, 10);
      const foundEmail = await query("SELECT * FROM users WHERE email=?", [
        email,
      ]);
      if (foundEmail.length > 0) {
        res.status(400).json({ msg: "Email is already taken" });
      } else {
        const foundMajor = await query("SELECT * FROM majors WHERE id=?", [
          major_id,
        ]);
        if (foundMajor.length > 0) {
          await query(
            "INSERT INTO users(email, password, name, address, age, role_id, major_id, status) VALUES(?,?,?,?,?,?,?,?)",
            [email, hashPassword, name, address, age, 1, major_id, 1]
          );
          res.status(201).json({ msg: "Create users success" });
        } else {
          res.status(400).json({ msg: "Major is not available" });
        }
      }
    } else {
      res.status(400).json({ msg: "Input is not valid" });
    }
  } catch (err) {
    res.status(404).json({ msg: "Something wrong" });
  }
});

router.delete("/users/:id", isSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const foundUser = await query("SELECT id, role_id FROM users WHERE id=?", [
      id,
    ]);
    if (foundUser.length > 0 && foundUser[0].role_id === 1) {
      await query("DELETE FROM users WHERE id=?", [id]);
      res.json({ msg: "Delete user success" });
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (err) {
    res.status(404).json({ msg: "Something wrong" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, address, age, major_id } = req.body;

    if (email && name && address && age && major_id) {
      const foundUser = await query(
        "SELECT id, role_id FROM users WHERE id=?",
        [id]
      );
      if (foundUser.length > 0) {
        const foundMajor = await query("SELECT id FROM majors WHERE id=?", [
          major_id,
        ]);
        if (foundMajor.length > 0) {
          await query(
            "UPDATE users SET email=?, name=?, age=?, major_id=? WHERE id=?",
            [email, name, age, major_id, id]
          );
          res.json({ msg: "Update user success" });
        } else {
          res.status(400).json({ msg: "Major is not available" });
        }
      } else {
        res.status(400).json({ msg: "Input is valid" });
      }
    } else {
      res.status(400).json({ msg: "Input is valid" });
    }
  } catch (err) {
    res.status(400).json({ msg: "Somthing wrong" });
  }
});

router.put("/change-password/:id", isOriganizer, async (req, res) => {
  try {
    const { major_id } = req.user;
    const { id } = req.params;
    const { password, password_two } = req.body;
    if (password && password_two) {
      if (password === password_two) {
        if (!major_id) {
          const foundUser = await query(
            "SELECT * FROM users WHERE id=? AND role_id=?",
            [id, 1]
          );
          if (foundUser.length > 0) {
            const hashPassword = await bcrypt.hash(password, 10);
            await query("UPDATE users SET password=? WHERE id=?", [
              hashPassword,
              id,
            ]);
            return res.json({ msg: "Reset Password Success" });
          } else {
            return res.status(401).json({ msg: "User not found" });
          }
        } else {
          const foundUser = await query(
            "SELECT * FROM users WHERE id=? AND major_id=?",
            [id, major_id]
          );
          if (foundUser.length > 0) {
            const hashPassword = await bcrypt.hash(password, 10);
            await query("UPDATE users SET password=? WHERE id=?", [
              hashPassword,
              id,
            ]);
            return res.json({ msg: "Reset Password Success" });
          } else {
            return res.status(401).json({ msg: "User not found" });
          }
        }
      } else {
        res.status(400).json({ msg: "Password is not same" });
      }
    } else {
      res.status(400).json({ msg: "Input is not valid" });
    }
  } catch (err) {
    res.status(400).json({ msg: "Somthing wrong" });
  }
});

router.get("/actived-user/:id", isOriganizer, async (req, res) => {
  try {
    const { major_id } = req.user;
    const { id } = req.params;

    const foundUser = await query(
      "SELECT id FROM users WHERE id=? AND major_id=?",
      [id, major_id]
    );
    if (foundUser.length > 0) {
      await query("UPDATE users SET status=? WHERE id=?", [1, id]);
      return res.json({ msg: "Success actived users" });
    } else {
      return res.status(401).json({ msg: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ msg: "Somthing wrong" });
  }
});

export default router;
