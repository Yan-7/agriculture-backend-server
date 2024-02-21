const mysql = require("mysql");
require("dotenv").config();

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Maximum number of connections in the pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const getAllPlots = (callback) => {
  pool.query("SELECT * FROM a", (error, results, fields) => {
    if (error) {
      console.error("Error fetching plots from the database:", error);
      return callback(error);
    }
    console.log("Data received from the database:", results);
    callback(null, results);
  });
};

const addPlot = (plot, callback) => {
  const sql =
    "INSERT INTO a (plantType, growthStage, waterLevel, phLevel, plantHealth) VALUES (?, ?, ?, ?, ?)";
  const values = [
    plot.plantType,
    plot.growthStage,
    plot.waterLevel,
    plot.phLevel,
    plot.plantHealth,
  ];

  pool.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error("Error inserting plot into the database:", error);
      return callback(error);
    }
    console.log("Plot inserted successfully. Insert ID:", results.insertId);
    callback(null, results.insertId); // Return the ID of the inserted plot
  });
};

module.exports = { getAllPlots, addPlot };
