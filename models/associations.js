const Researcher = require("./researcher");
const Group = require("./group");
const Teacher = require("./teacher");
const Thesis_files = require("./thesis_files");
const Thesis = require("./thesis");
const Exam_announcements = require("./exam_announcements");
const Exam_requests_files = require("./exam_requests_files");
const Exam_requests = require("./exam_requests");
const Free_hours = require("./free_hours");
const Categorie_room = require("./categorie_room");
const Exam_booking = require("./exam_booking");
const Exam_result = require("./exam_result");
// one to many
Group.hasMany(Researcher, { onDelete: "NO ACTION" });
Researcher.belongsTo(Group);

Researcher.hasOne(Group,{foreignKey: {
  name: 'leaderId'
}}, {onDelete:"NO ACTION"});
// Group.belongsTo(Researcher)


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

Exam_requests.hasMany(Exam_booking, { onDelete: "NO ACTION" });
Exam_booking.belongsTo(Exam_requests);

Exam_requests.hasMany(Exam_result, { onDelete: "NO ACTION" });
Exam_result.belongsTo(Exam_requests);

// Many to Many

Group.belongsToMany(Teacher, {
  through: "board",
  // as: "teachers",
  // foreignKey: "id",
});
Teacher.belongsToMany(Group, {
  through: "board",
  // as: "groups",
  // foreignKey: "id",
});

Group.belongsToMany(Exam_announcements, {
  through: "exam_requests",
  // as: "exam_announcements",
  // foreignKey: "examAnnouncementId",
});
Exam_announcements.belongsToMany(Group, {
  through: "exam_requests",
  // as: "groups",
  // foreignKey: "groupId",
});
