const express = require("express");

const free_hours_Controller = require("../controllers/free_hours");
const router = express.Router();

router.post("/add", free_hours_Controller.addHours);

router.post("/getEvent", free_hours_Controller.getEventListTch);
router.patch("/updateEvent", free_hours_Controller.updateEvent);
router.post("/delete", free_hours_Controller.deleteEvent);
router.get("/getAllEvents", free_hours_Controller.getAllEvents);
router.get(
  "/getEventOnlyGroup/:grpId",
  free_hours_Controller.getEventOnlyGroup
);
module.exports = router;
