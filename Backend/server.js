require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "Datachak",
  port: 5432, // Default PostgreSQL port
});

// Update User Data
app.put("/update-user/:id", async (req, res) => {
  const { firstName, lastName, email, phoneNumber, language } = req.body;
  const id = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone_number = $3, language = $4, email = $5
       WHERE id = $6 RETURNING *`,
      [firstName, lastName, phoneNumber, language, email, id]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ success: true, message: "User updated successfully", user: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.send("Backend is reachable");
});

// Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});