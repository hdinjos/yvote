import majorSeed from "./majors.js";
import roleSeed from "./roles.js";
import userSeed from "./users.js";

try {
  roleSeed();
  // majorSeed();
  // userSeed();
  console.log("seeder success");
} catch (err) {
  console.log(err);
}
