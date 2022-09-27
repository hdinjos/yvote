import majorSeed from "./majors.js";
import roleSeed from "./roles.js";
import userSeed from "./users.js";

const runSeed = async () => {
  try {
    await roleSeed();
    await majorSeed();
    await userSeed();
    console.log("seeder success");
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(1);
  }
};

runSeed();
