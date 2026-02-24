const pool = require("../config/db");

async function createTask(params) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { projectId, title, description, assignedUserId } = params;

    const taskResult = await client.query(
      `
      INSERT INTO tasks (
        project_id,
        title,
        description,
        status,
        assigned_user_id
      )
      VALUES ($1, $2, $3, 'todo', $4)
      RETURNING *
      `,
      [projectId, title, description, assignedUserId],
    );

    const task = taskResult.rows[0];

    await client.query(
      `
      INSERT INTO task_status_history (
        task_id,
        old_status,
        new_status,
        changed_by
      )
      VALUES ($1, $2, $3, $4)
      `,
      [task.id, null, "todo", assignedUserId],
    );

    await client.query("COMMIT");
    return task;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getAllTasks() {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE is_deleted = FALSE",
  );
  return result.rows;
}

async function updateTaskStatus(taskId, newStatus, isDeleted, changedBy) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const taskResult = await client.query(
      "SELECT status FROM tasks WHERE id = $1 AND is_deleted = FALSE",
      [taskId],
    );

    if (taskResult.rowCount === 0) {
      throw new Error("Task not found");
    }

    const oldStatus = taskResult.rows[0].status;

    await client.query(
      `
      UPDATE tasks
      SET status = $1, updated_at = NOW(), is_deleted = $3
      WHERE id = $2
      `,
      [newStatus, taskId, isDeleted],
    );

    await client.query(
      `
      INSERT INTO task_status_history (
        task_id,
        old_status,
        new_status,
        changed_by
      )
      VALUES ($1, $2, $3, $4)
      `,
      [taskId, oldStatus, newStatus, changedBy],
    );

    const updatedTask = await client.query(
      "SELECT * FROM tasks WHERE id = $1",
      [taskId],
    );

    await client.query("COMMIT");
    return updatedTask.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  createTask,
  getAllTasks,
  updateTaskStatus,
};
