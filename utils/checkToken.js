const jwt = require("jsonwebtoken");

const checkToken = async (token) => {
  console.log("check func");
  try {
    if (!token) {
      return "no token";
    }
    const decoded = jwt.verify(token, "soybad");
    console.log(decoded);
    console.log("check top");
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = checkToken;
