import config from "./config.js";

async function query(sql, params) {
  const [results] = await config.execute(sql, params);

  return results;
}

export default query;
