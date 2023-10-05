const Researcher = require("../models/researcher");
const Categories = require("../models/categorie_room");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Teacher = require("../models/teacher");
exports.login = async (req, res, next) => {
  const id = req.body.id;
  const password = req.body.password;
  let loadedUser;

  await Researcher.findOne({ where: { student_id: id, isActive: true } })
    .then(async (researcher) => {
      if (!researcher) {
        return res.status(404).json("user not found");
      }
      loadedUser = researcher;

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
          role: "researcher",
        },
        "soybad",
        {
          expiresIn: "5d",
        }
      );
      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        })
        .json({
          token: token,
          userId: loadedUser.id.toString(),
          userName: loadedUser.firstname,
          status: 200,
          grpId: loadedUser.groupId,
          userData: loadedUser,
          role: "researcher",
        });
    })
    .catch((err) => {
      return err;
    });
};

exports.loginTch = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.pwd;
  let loadedUser;

  await Teacher.findOne({ where: { email: email } })
    .then(async (teacher) => {
      if (!teacher) {

        await Admin.findOne({ where: { email: email } })
          .then(async (admin) => {
            if (!admin) {
              return res.status(404).json("User not found");
            }

            loadedAdmin = admin;

            return await bcrypt.compare(password, loadedAdmin.pwd);
          })
          .then((isEqual) => {
            if (!isEqual) {
              const err = new Error("Wrong password");
              err.statuscode = 401;
              return res.status(401).json(err);
            }
            const token = jwt.sign(
              {
                email: loadedAdmin.email,
                userId: loadedAdmin.id.toString(),
                role: "admin",
              },
              "soybad",
              {
                expiresIn: "5d",
              }
            );
            return res
              .status(200)
              .cookie("token", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, 
              })
              .json({
                token: token,
                userId: loadedAdmin.id.toString(),
                userName: loadedAdmin.username,
                status: 200,
                role: "admin",
              });
          });
      }
      loadedUser = teacher;
      const pwdCompare = await bcrypt.compare(password, loadedUser.pwd);
      return { pwdCompare, teacher };
    })
    .then((isEqual) => {
      if (!isEqual.pwdCompare) {
        const error = new Error("Wrong password");
        error.statuscode = 401;
        return res.status(401).json(error);
      }

      let isAdmin = false;

      if (isEqual.teacher.dataValues.isAdmin === true) {
        isAdmin = true;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id.toString(),
          role: isAdmin ? "admin" : "teacher",
        },
        "soybad",
        {
          expiresIn: "5d",
        }
      );
      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          token: token,
          userId: loadedUser.id.toString(),
          userName: loadedUser.firstname,

          status: 200,
          role: isAdmin ? "admin" : "teacher",
        });
    })
    .catch((err) => {
      return err;
    });
};
exports.check = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return res.status(401).json("Unauthorized : No token provided");
  }
  try {
    const decoded = jwt.verify(token, "soybad");
    const userId = decoded.userId;
    const userRole = decoded.role;
    console.log("userRole : ", userRole);
    let userData;

    if (userRole === "researcher") {
      userDta = await Researcher.findOne({
        where: { id: parseInt(userId) },
        include: Categories,
      });
    } else if (userRole === "teacher") {
      userData = await Teacher.findOne({
        where: { id: parseInt(userId) },
      });
    } else if (userRole === "admin") {
      userData = await Admin.findOne({
        where: { id: parseInt(userId) },
      });
    } else {
      return res.status(501).json("No role for account");
    }

    
    return res
      .status(200)
      .json({ isAuth: true, userData: userData, userRole: userRole });
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token : " + err,
      isAuth: false,
    });
  }
};

exports.logout = async (req, res, nect) => {
  res.clearCookie("token", { httpOnly: true });
  res.json({ message: "cookie cleared" });
};
