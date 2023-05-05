const Researcher = require("./researcher");
const Group = require("./group");
const Teacher = require("./teacher");
const Thesis_files = require("./thesis_files");
const Thesis = require("./thesis");
const Exam_announcements = require("./exam_announcements");
const Exam_requests_files = require("./exam_requests_files");
const Exam_requests = require("./exam_requests");
const Free_hours = require('./free_hours')
const Categorie_room = require('./categorie_room')
// one to many
Group.hasMany(Researcher, { onDelete: "NO ACTION" });
Researcher.belongsTo(Group);

Group.hasMany(Thesis, { onDelete: "NO ACTION" });
Thesis.belongsTo(Group);

Thesis.hasMany(Thesis_files, { onDelete: "NO ACTION" });
Thesis_files.belongsTo(Thesis);

Exam_requests.hasMany(Exam_requests_files, { onDelete: "NO ACTION" });
Exam_requests_files.belongsTo(Exam_requests);

Teacher.hasMany(Free_hours, { onDelete: "NO ACTION" });
Free_hours.belongsTo(Teacher);

Categorie_room.hasMany(Researcher, { onDelete: "NO ACTION" });
Researcher.belongsTo(Categorie_room);

// Many to Many

Group.belongsToMany(Teacher, { through: "board" });
Teacher.belongsToMany(Group, { through: "board" });

Group.belongsToMany(Exam_announcements, { through: "exam_requests" });
Exam_announcements.belongsToMany(Group, { through: "exam_requests" });
