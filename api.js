// Loads the express library to help us create a web server easily.
const express = require("express");
// Loads functions from the 'plot.js' file. These functions interact with the database.
const { getAllPlots, addPlot } = require("./plot");
const cors = require("cors");
// Loads the dotenv library to manage environment variables from a '.env' file.
require("dotenv").config();

// Creates an instance of an express application to set up our server.
const app = express();
// Tells our express application to automatically parse JSON data in request bodies.
app.use(express.json());

app.use(cors());

// Defines a GET endpoint at the URL path '/plots'.
// This is what happens when someone goes to our site and adds '/plots' at the end of the URL.
app.get("/plots", (req, res) => {
  // Calls the getAllPlots function defined in 'plot.js' to get data from our database.
  getAllPlots((err, plots) => {
    // Checks if there was an error fetching the plots.
    if (err) {
      // If there's an error, it prints the error to the console and sends a 500 error response.
      console.error("Error fetching plots:", err);
      return res.status(500).json({ message: "Error fetching plots" });
    }
    // If everything is OK, it sends the plots data back to the person who requested it.
    res.json(plots);
  });
});

// Defines a POST endpoint at the same URL path '/plots'.
// This is for when someone wants to add a new plot to our database through our website.
app.post("/plots", (req, res) => {
  // Calls the addPlot function, giving it the data sent in the request body.
  addPlot(req.body, (err, insertId) => {
    // Checks if there was an error adding the plot to the database.
    if (err) {
      // If there's an error, it prints the error to the console and sends a 500 error response.
      console.error("Error adding plot:", err);
      return res.status(500).json({ message: "Error adding plot" });
    }
    // If the plot was added successfully, it sends back a 201 status (which means "created")
    // and includes the ID of the newly added plot and the data that was added.
    res.status(201).json({ id: insertId, ...req.body });
  });
});

// Reads the port number from the environment variables or uses 5000 if it's not set.
const port = process.env.PORT || 5000;
// Starts the server and makes it listen on the specified port.
app.listen(port, () => {
  // Prints a message to the console saying the server is running and on which port.
  console.log(`Server running on port ${port}`);
});
