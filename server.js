// module
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const multer = require("multer");

// route
const researcher = require("./models/researcher");
const group = require("./models/group");
const teacher = require("./models/teacher");
const free_hours = require("./models/free_hours");
const board = require("./models/board");
const thesis = require("./models/thesis");
const Thesis_files = require("./models/thesis_files");
const exam_requests_files = require("./models/exam_requests_files");
const announcements = require("./models/exam_announcements");
const exam_requests = require("./models/exam_requests");
const categorie_room = require("./models/categorie_room");
const admin = require("./models/admin");
const files = require("./models/files");
const Exam_requests_files = require("./models/exam_requests_files");
const Files = require("./models/files");

// model
require("./models/associations");
const researcherRoutes = require("./routes/researcher");
const categoriesRoutes = require("./routes/categories");
const teacherRoutes = require("./routes/teacher");
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/group");
const boardRoutes = require("./routes/boards");
const freeHoursRoute = require("./routes/free_hours");
const requestExamRoute = require("./routes/request_exam");
const filesRoute = require("./routes/files");
const bookingRoute = require("./routes/exam_booking");
const resultRoute = require("./routes/exam_result");
const thesisRoute = require("./routes/thesis");
const dashboardRoute = require("./routes/dashboard");
const sequelize = require("./db");

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.patch("/cors", (req, res) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length,Server,Date,access-control-allow-methods,access-control-allow-origin,mutipart/form-data"
  );
  res.send("ok");
});

app.use(express.static(path.join(__dirname, "public")));
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9_.-]/g, "");
};
app.get("/files/upload/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  try {
    const file = await Files.findOne({ where: { originalname: slug } });
    const sanitizedSlug = sanitizeFilename(file.originalname);
    const pdfFilePath = path.join(
      __dirname,
      "upload",
      "files",
      "files",
      `${file.filename ? file.filename : ""}`
    );
    console.log(pdfFilePath);

    if (fs.existsSync(pdfFilePath)) {
      // Read the file data and send it as a response
      const pdfData = fs.readFileSync(pdfFilePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename*=UTF-8''${encodeURIComponent(file.originalname)}`
      );
      res.send(pdfData);
    } else {
      res.status(404).send("File not found.");
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json(er);
  }
});

app.get("/files/request/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  try {
    const file = await Exam_requests_files.findOne({
      where: { originalname: slug },
    });
    const sanitizedSlug = sanitizeFilename(file.originalname);
    const pdfFilePath = path.join(
      __dirname,
      "upload",
      "files",
      "requestExam",
      `${file.filename ? file.filename : ""}`
    );
    console.log(pdfFilePath);

    if (fs.existsSync(pdfFilePath)) {
      const pdfData = fs.readFileSync(pdfFilePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename*=UTF-8''${encodeURIComponent(file.originalname)}`
      );
      res.send(pdfData);
    } else {
      res.status(404).send("File not found.");
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json(er);
  }
});
app.get("/files/thesis/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  try {
    const file = await Thesis_files.findOne({
      where: { filename: slug },
    });
    const sanitizedSlug = sanitizeFilename(file.filename);
    const pdfFilePath = path.join(
      __dirname,
      "upload",
      "files",
      "thesis",
      `${file.filename ? file.filename : ""}`
    );
    console.log(pdfFilePath);

    if (fs.existsSync(pdfFilePath)) {
      const pdfData = fs.readFileSync(pdfFilePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename*=UTF-8''${encodeURIComponent(file.originalname)}`
      );
      res.send(pdfData);
    } else {
      res.status(404).send("File not found.");
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json(er);
  }
});
app.use("/researcher", researcherRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/teachers", teacherRoutes);
app.use("/boards", boardRoutes);
app.use("/group", groupRoutes);
app.use("/free_hours", freeHoursRoute);
app.use("/requestExam", requestExamRoute);
app.use("/files", filesRoute);
app.use("/exam_booking", bookingRoute);
app.use("/result", resultRoute);
app.use("/thesis", thesisRoute);
app.use("/dashboard", dashboardRoute);
sequelize
  .sync({})
  .then((result) => {
    console.log("Server Start.....");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
