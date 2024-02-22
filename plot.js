// Loads the mysql2 library to connect to your MySQL database.
const mysql = require("mysql2");
// Loads the dotenv library to manage environment variables from a '.env' file.
require("dotenv").config();

// Creates a connection pool to the database. This means instead of connecting and disconnecting
// every time we need the database, we keep a few connections open and reuse them,
// which is faster and more efficient.
const pool = mysql.createPool({
  connectionLimit: 10, // The maximum number of connections to create at once.
  host: process.env.DB_HOST, // The database server address.
  user: process.env.DB_USER, // The database username.
  password: process.env.DB_PASSWORD, // The database password.
  database: process.env.DB_NAME, // The name of the database to connect to.
});

// A function to get all plot data from the database.
const getAllPlots = (callback) => {
  // Uses the pool to run a query on the database. This query gets everything from the 'plots' table.
  pool.query("SELECT * FROM plots", (error, results, fields) => {
    // Checks if there was an error with the query.
    if (error) {
      // If there's an error, print it to the console and send the error back to the caller.
      console.error("Error fetching plots from the database:", error);
      return callback(error);
    }
    // If there's no error, print the data to the console and send the data back to the caller.
    console.log("Data received from the database:", results);
    callback(null, results);
  });
};

// A function to add a new plot to the database.
const addPlot = (plot, callback) => {
  // SQL query to insert a new plot into the 'plots' table. '?' placeholders will be replaced by the values array.
  const sql =
    "INSERT INTO plots (plantType, growthStage, waterLevel, phLevel, plantHealth) VALUES (?, ?, ?, ?, ?)";
  // An array of values to replace the '?' placeholders in the SQL query.
  const values = [
    plot.plantType,
    plot.growthStage,
    plot.waterLevel,
    plot.phLevel,
    plot.plantHealth,
  ];

  // Runs the query to insert the new plot, using the values array to replace the placeholders.
  pool.query(sql, values, (error, results, fields) => {
    // Checks if there was an error with the query.
    if (error) {
      // If there's an error, print it to the console and send the error back to the caller.
      console.error("Error inserting plot into the database:", error);
      return callback(error);
    }
    // If there's no error, print a success message to the console including the new plot's ID,
    // and send the new plot's ID back to the caller.
    console.log("Plot inserted successfully. Insert ID:", results.insertId);
    callback(null, results.insertId);
  });
};

// Exports the functions so they can be used in other files, like our api.js.
module.exports = { getAllPlots, addPlot };
