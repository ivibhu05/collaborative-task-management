const express = require("express");
const projectController = require("../controllers/projectController");

const router = express.Router();

router.post("/", projectController.createProject);
router.get("/", projectController.getAllProjects);

module.exports = router;
