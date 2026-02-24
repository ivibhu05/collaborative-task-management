const projectService = require("../services/projectService");

async function createProject(req, res) {
  try {
    const { name, ownerId } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({ message: "name and ownerId are required" });
    }

    const project = await projectService.createProject(name, ownerId);

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createProject,
};
