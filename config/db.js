const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the connection
(async () => {
  try {
    // Running a simple query to check the connection
    const [rows, fields] = await pool.promise().query('SELECT 1 + 1 AS solution');
    console.log('Database connected successfully:', rows[0].solution); // Should print: 2
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
})();

module.exports = pool.promise();
