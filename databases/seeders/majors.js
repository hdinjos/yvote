import query from "../query.js";

async function majorSeed() {
  const sql = "INSERT INTO majors (name) VALUES(?)";
  const data = [["Informatika"], ["Management"], ["Electro"]];
  for (let i = 0; i < data.length; i++) {
    await query(sql, data[i]);
  }
}

export default majorSeed;
