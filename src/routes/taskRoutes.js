const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.patch("/:id", taskController.updateTaskStatus);

module.exports = router;
