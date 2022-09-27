import query from "../query.js";

async function roleSeed() {
  const sql = "INSERT INTO roles (name) VALUES(?)";
  const data = [["panitia"], ["user"]];
  for (let i = 0; i < data.length; i++) {
    await query(sql, data[i]);
  }
}

export default roleSeed;
