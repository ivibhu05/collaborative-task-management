const pool = require("../config/db");

async function updateTaskStatus(taskId, newStatus, changedBy) {
  const client = await pool.connect();

  try {
    client.query("BEGIN");

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
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [newStatus, taskId],
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
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  updateTaskStatus,
};
