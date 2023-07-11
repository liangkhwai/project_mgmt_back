const express = require("express");
const researcher = require("./models/researcher");
const group = require("./models/group");
const teacher = require("./models/teacher");
const free_hours = require("./models/free_hours");
const board = require("./models/board");
const thesis = require("./models/thesis");
const thesis_files = require("./models/thesis_files");
const exam_requests_files = require("./models/exam_requests_files");
const announcements = require("./models/exam_announcements");
const exam_requests = require("./models/exam_requests");
const categorie_room = require("./models/categorie_room");
const admin = require("./models/admin");
require("./models/associations");
const researcherRoutes = require("./routes/researcher");
const categoriesRoutes = require("./routes/categories");
const teacherRoutes = require("./routes/teacher");
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/group");
const sequelize = require("./db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"],
  credentials: true,
  // allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.patch("/cors", (req, res) => {
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length,Server,Date,access-control-allow-methods,access-control-allow-origin"
  );
  // res.header(
  //   "Access-Control-Allow-Methods",
  //   "PUT,POST,GET,DELETE,OPTIONS,PATCH"
  // );
  res.send("ok");
});


// app.use((req, res, next) => {
//   // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   // res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,Accept,Origin,Content-Type,Authorization"
//   );
//   // res.setHeader("Access-Control-Allow-Credentials", "true");

//   next();
// });
// app.use((req, res, next) => {
//   // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   // res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,Accept,Origin,Content-Type,Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "http://localhost:3000"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE"
//   );
//   next();
// });


app.use("/researcher", researcherRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/teachers", teacherRoutes);
app.use("/group", groupRoutes);
sequelize
  .sync({})
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
