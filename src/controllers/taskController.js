const taskService = require("../services/taskService");

async function createTask(req, res) {
  try {
    const { projectId, title, description, assignedUserId } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({
        message: "projectId and title are required",
      });
    }

    const task = await taskService.createTask({
      projectId,
      title,
      description,
      assignedUserId,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllTasks(req, res) {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, isDeleted, changedBy } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "task id is required",
      });
    }

    const updatedTask = await taskService.updateTaskStatus(
      id,
      status,
      isDeleted,
      changedBy,
    );

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  createTask,
  getAllTasks,
  updateTaskStatus,
};
