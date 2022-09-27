import query from "../query.js";
import bcrypt from "bcryptjs";

async function userSeed() {
  const hash = await bcrypt.hash("123456", 10);
  const sql =
    "INSERT INTO users (email, password, name, address, age, role_id, major_id) VALUES(?, ?, ?, ?, ?, ?, ?)";
  const data = [
    ["panitia_it@gg.com", hash, "admin", "Yogyakarta", 0, 1, 1],
    ["user_it@gg.com", hash, "user", "Yogyakarta", 0, 2, 1],
  ];

  for (let i = 0; i < data.length; i++) {
    await query(sql, data[i]);
  }
}

export default userSeed;
