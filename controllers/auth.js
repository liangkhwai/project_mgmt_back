const Researcher = require("../models/researcher");
const Categories = require("../models/categorie_room");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Teacher = require("../models/teacher");
const Group = require("../models/group");
// exports.login = async (req, res, next) => {
//   const id = req.body.id.trim();
//   const password = req.body.password.trim();
//   let loadedUser;

//   await Researcher.findOne({ where: { student_id: id, isActive: true } })
//     .then(async (researcher) => {
//       if (!researcher) {
//         return res.status(404).json("user not found");
//       }
//       loadedUser = researcher;

//       return await bcrypt.compare(password, loadedUser.pwd.toString());
//     })
//     .then((isEqual) => {
//       if (!isEqual) {
//         const error = new Error("Wrong password");
//         error.statuscode = 401;
//         return res.status(401).json(error);
//       }
//       const token = jwt.sign(
//         {
//           email: loadedUser.email,
//           userId: loadedUser.id.toString(),
//           role: "researcher",
//         },
//         "soybad",
//         {
//           expiresIn: "5d",
//         }
//       );
//       return res
//         .status(200)
//         .cookie("token", token, {
//           httpOnly: true,
//           maxAge: 7 * 24 * 60 * 60 * 1000,
//         })
//         .json({
//           token: token,
//           userId: loadedUser.id.toString(),
//           userName: loadedUser.firstname,
//           status: 200,
//           grpId: loadedUser.groupId,
//           userData: loadedUser,
//           role: "researcher",
//         });
//     })
//     .catch((err) => {
//       return err;
//     });
// };
exports.login = async (req, res, next) => {
  const id = req.body.id.trim();
  const password = req.body.password.trim();

  try {
    let researcher = await Researcher.findOne({
      where: { student_id: id, isActive: true },
    });

    if (!researcher) {
      return res.status(404).json("User not found");
    }

    const isEqual = await bcrypt.compare(password, researcher.pwd.toString());

    if (!isEqual) {
      return res.status(401).json("Wrong password");
    }
    try {
      console.log(researcher);
      const token = jwt.sign(
        {
          email: researcher.email,
          userId: researcher.id,
          role: "researcher",
        },
        "soybad",
        {
          expiresIn: "5d",
        }
      );
      console.log(token);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite:'None'
      });
      

      return res.status(200).json({
        token: token,
        userId: researcher.id.toString(),
        userName: researcher.firstname,
        status: 200,
        grpId: researcher.groupId,
        userData: researcher,
        role: "researcher",
      });
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json(error);
  }
};

exports.loginTch = async (req, res, next) => {
  const email = req.body.email.trim();
  const password = req.body.pwd.trim();
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

exports.checkRole = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json("Unauthorized : No token provided");
    }
    const decoded = jwt.verify(token, "soybad");
    const userId = decoded.userId;
    const userRole = decoded.role;
    console.log(decoded);
    if (userRole === "admin") {
      const admin = await Admin.findOne({ where: { id: userId } });
      if (admin) {
        return res
          .status(200)
          .json({ isAuth: true, role: "admin", data: admin });
      } else {
        const teacherAdmin = await Teacher.findOne({
          where: { id: userId, isAdmin: true },
        });
        if (teacherAdmin) {
          return res
            .status(200)
            .json({ isAuth: true, role: "admin", data: teacherAdmin });
        } else {
          return res.status(200).json({ isAuth: false });
        }
      }
    } else if (userRole === "researcher") {
      const researcher = await Researcher.findOne({
        where: { id: userId },
        include: [Group, Categories],
      });
      return res
        .status(200)
        .json({ isAuth: true, role: "researcher", data: researcher });
    } else {
      const teacher = await Teacher.findOne({ where: { id: userId } });
      return res
        .status(200)
        .json({ isAuth: true, role: "teacher", data: teacher });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.changePassword = async (req, res, next) => {
  const id = req.body.id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  console.log(req.body);

  const role = req.body.role;
  let loadedUser;
  if (role === "researcher") {
    await Researcher.findOne({ where: { id: id } })
      .then(async (researcher) => {
        if (!researcher) {
          return res.status(404).json("user not found");
        }
        loadedUser = researcher;

        return await bcrypt.compare(oldPassword, loadedUser.pwd.toString());
      })
      .then(async (isEqual) => {
        if (!isEqual) {
          const error = new Error("Wrong password");
          error.statuscode = 401;
          return res.status(401).json(error);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        loadedUser.pwd = hashedPassword;
        await loadedUser.save();
        return res.status(200).json("success");
      })
      .catch((err) => {
        return err;
      });
  } else if (role === "teacher") {
    await Teacher.findOne({ where: { id: id } })
      .then(async (teacher) => {
        if (!teacher) {
          return res.status(404).json("user not found");
        }
        loadedUser = teacher;

        return await bcrypt.compare(oldPassword, loadedUser.pwd.toString());
      })
      .then(async (isEqual) => {
        if (!isEqual) {
          const error = new Error("Wrong password");
          error.statuscode = 401;
          return res.status(401).json(error);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        loadedUser.pwd = hashedPassword;
        await loadedUser.save();
        return res.status(200).json("success");
      })
      .catch((err) => {
        return err;
      });
  } else {
    console.log("admin na");
    const admin = await Admin.findOne({ where: { id: id } });
    if (admin) {
      await Admin.findOne({ where: { id: id } })
        .then(async (admin) => {
          if (!admin) {
            return res.status(404).json("user not found");
          }
          loadedUser = admin;

          return await bcrypt.compare(oldPassword, loadedUser.pwd.toString());
        })
        .then(async (isEqual) => {
          if (!isEqual) {
            const error = new Error("Wrong password");
            error.statuscode = 401;
            return res.status(401).json(error);
          }
          const hashedPassword = await bcrypt.hash(newPassword, 12);
          loadedUser.pwd = hashedPassword;
          await loadedUser.save();
          return res.status(200).json("success");
        })
        .catch((err) => {
          return err;
        });
    } else {
      console.log("not found admin but teacher");
      await Teacher.findOne({ where: { id: id, isAdmin: true } })
        .then(async (admin) => {
          if (!admin) {
            return res.status(404).json("user not found");
          }
          loadedUser = admin;

          return await bcrypt.compare(oldPassword, loadedUser.pwd.toString());
        })
        .then(async (isEqual) => {
          if (!isEqual) {
            const error = new Error("Wrong password");
            error.statuscode = 401;
            return res.status(401).json(error);
          }
          const hashedPassword = await bcrypt.hash(newPassword, 12);
          loadedUser.pwd = hashedPassword;
          await loadedUser.save();
          return res.status(200).json("success");
        })
        .catch((err) => {
          return err;
        });
    }
  }
};
