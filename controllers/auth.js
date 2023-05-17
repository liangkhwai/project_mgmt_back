const Researcher = require("../models/researcher");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Teacher = require("../models/teacher");
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
        {
          email: loadedUser.email,
          userId: loadedUser.id.toString(),
          
        },
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
          role: "researcher",
        });
    })
    .catch((err) => {
      return err;
    });
};

exports.loginTch = async (req, res, next) => {
  console.log("tchLogged");
  const email = req.body.email;
  const password = req.body.pwd;
  console.log(req.body);
  let loadedUser;

  await Teacher.findOne({ where: { email: email } })
    .then(async (teacher) => {
      if (!teacher) {
        console.log("not found");
        return res.status(404).json("user not found");
      }
      loadedUser = teacher;
      // console.log(researcher)
      console.log(loadedUser);
      console.log(typeof password, typeof loadedUser.pwd);
      console.log(password, loadedUser.pwd);

      return await bcrypt.compare(password, loadedUser.pwd);
      // return true
    })
    .then((isEqual) => {
      console.log(isEqual);
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statuscode = 401;
        return res.status(401).json(error);
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id.toString(),
          role: "teacher",
        },
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
          role: "teacher",
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
