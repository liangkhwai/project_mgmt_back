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
const files = require("./models/files");
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
const sequelize = require("./db");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const Files = require("./models/files");
const app = express();
const upload = multer();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"],
  credentials: true,
  // allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 1000000 })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.text({ type: "text/*", limit: "50mb" }));

app.patch("/cors", (req, res) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length,Server,Date,access-control-allow-methods,access-control-allow-origin,mutipart/form-data"
  );
  res.send("ok");
});

app.use(express.static(path.join(__dirname, "public")));
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9_.-]/g, '');
};
app.get("/files/upload/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  try{
    const file = await Files.findOne({ where: { originalname: slug } });
    const sanitizedSlug = sanitizeFilename(file.originalname)
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
  }catch(er){
    console.log(er);
    return res.status(500).json(er)
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
sequelize
  .sync({})
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
