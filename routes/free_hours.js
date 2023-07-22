const express = require("express");

const free_hours_Controller = require("../controllers/free_hours");
const router = express.Router();

router.post("/add", free_hours_Controller.addHours);

router.post('/getEvent',free_hours_Controller.getEventListTch)
router.patch('/updateEvent',free_hours_Controller.updateEvent)
router.post('/delete',free_hours_Controller.deleteEvent)

module.exports = router;
