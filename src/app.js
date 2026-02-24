const express = require("express");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
app.use(express.json());

app.use("/projects", projectRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
