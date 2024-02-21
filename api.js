// api.js
const express = require("express");
const { getAllPlots, addPlot } = require("./plot"); // Ensure the path is correct
require("dotenv").config(); // If you're using environment variables

const app = express();
app.use(express.json());

// GET endpoint to retrieve all plots
app.get("/plots", (req, res) => {
  getAllPlots((err, plots) => {
    if (err) {
      console.error("Error fetching plots:", err);
      return res.status(500).json({ message: "Error fetching plots" });
    }
    res.json(plots);
  });
});

// POST endpoint to add a new plot
app.post("/plots", (req, res) => {
  addPlot(req.body, (err, insertId) => {
    if (err) {
      console.error("Error adding plot:", err);
      return res.status(500).json({ message: "Error adding plot" });
    }
    res.status(201).json({ id: insertId, ...req.body });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
