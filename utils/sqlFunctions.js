const db = require("../config/db");

// Create table function
const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      userId VARCHAR(36) PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log("Executing table creation query...");
    await db.query(createTableQuery);
    console.log("User table created or already exists.");
  } catch (err) {
    console.error("Error creating table manually:", err.message);
    throw err;
  }
};

// Main function to initialize the database
const initializeDB = async () => {
  try {
    await createTable();  // Call the table creation function
  } catch (err) {
    console.error("Initialization error:", err.message);
  }
};

initializeDB();  // Start the initialization process

// Check if a record exists function
const checkRecordExists = async (tableName, column, value) => {
  console.log(`Checking for record in ${tableName} where ${column} =`, value);
  try {
    const [results] = await db.query(`SELECT * FROM ${tableName} WHERE ${column} = ?`, [value]);
    console.log(`Check Result:`, results);
    return results.length ? results[0] : null;
  } catch (err) {
    console.error(`Error checking record existence: ${err.message}`);
    throw err;
  }
};

// Insert record function
const insertRecord = async (tableName, record) => {
  console.log(`Inserting record into ${tableName}:`, record);
  if (!record || !Object.keys(record).length) {
    console.error("Insert Failed: Record data is missing or invalid.");
    throw new Error("Record data is missing or invalid.");
  }

  try {
    const [results] = await db.query(`INSERT INTO ${tableName} SET ?`, [record]);
    console.log('Insert Result:', results);
    return results;
  } catch (err) {
    console.error(`Database Insertion Error: ${err.message}`);
    throw err;
  }
};

module.exports = {
  createTable,
  checkRecordExists,
  insertRecord,
};
