const express = require("express");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
