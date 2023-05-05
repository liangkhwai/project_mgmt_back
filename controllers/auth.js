const Researcher = require("../models/researcher");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.login = async (req, res, next) => {
  const id = req.body.id;
  const password = req.body.password;
  let loadedUser;

  await Researcher.findOne({ where: { student_id: id } })
    .then(async (researcher) => {
      if (!researcher) {
        return res.status(404).json("user not found");
      }
      loadedUser = researcher;
      // console.log(researcher)

      return await bcrypt.compare(password, loadedUser.pwd.toString());
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statuscode = 401;
        return res.status(401).json(error);
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser.id.toString() },
        "soybad",
        {
          expiresIn: "5d",
        }
      );
      // res.json({message:"success"})

      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000, // 1 hour
        })
        .json({
          token: token,
          userId: loadedUser.id.toString(),
          userName: loadedUser.firstname,
          status: 200,
        });
    })
    .catch((err) => {
      return err;
    });
};

exports.check = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json("Unauthorized : No token provided");
  }
  try {
    const decoded = jwt.verify(token, "soybad");
    console.log(decoded);
    res.status(200).json({ isAuth: true });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", isAuth: false });
  }
};

exports.logout = async (req, res, nect) => {
  res.clearCookie("token", { httpOnly: true });
  res.json({ message: "cookie cleared" });
};
