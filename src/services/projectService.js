const pool = require("../config/db");

async function createProject(name, ownerId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectResult = await client.query(
      `
      INSERT INTO projects (name, owner_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, ownerId],
    );

    const project = projectResult.rows[0];

    await client.query(
      `
      INSERT INTO project_members (project_id, user_id)
      VALUES ($1, $2)
      `,
      [project.id, ownerId],
    );

    await client.query("COMMIT");
    return project;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createProject,
};
