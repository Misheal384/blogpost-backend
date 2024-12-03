const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");
const {
  createTable,
  checkRecordExists,
  insertRecord,
} = require("../utils/sqlFunctions");

// Function to generate JWT access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


// Registration endpoint
// Registration endpoint
const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Log incoming request data
  console.log('Request Body:', req.body);

  // Validate input fields and log missing values
  if (!username) {
    console.log('Validation Failed: Missing Username');
    return res.status(400).json({ error: "Username is required!" });
  }
  if (!email) {
    console.log('Validation Failed: Missing Email');
    return res.status(400).json({ error: "Email is required!" });
  }
  if (!password) {
    console.log('Validation Failed: Missing Password');
    return res.status(400).json({ error: "Password is required!" });
  }
  if (!confirmPassword) {
    console.log('Validation Failed: Missing Confirm Password');
    return res.status(400).json({ error: "Confirm Password is required!" });
  }
  if (password !== confirmPassword) {
    console.log('Validation Failed: Passwords do not match');
    return res.status(400).json({ error: "Passwords do not match!" });
  }

  try {
    // Log before checking if the user exists
    console.log('Checking if the user already exists with email:', email);
    const userAlreadyExists = await checkRecordExists("users", "email", email);
    if (userAlreadyExists) {
      console.log('Validation Failed: Email already exists');
      return res.status(409).json({ error: "Email already exists" });
    }

    // Log before hashing the password
    console.log('Hashing password for user:', username);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password:", hashedPassword);

    // Log user object before inserting into the database
    const user = {
      userId: uuidv4(),
      username,
      email,
      password: hashedPassword,
    };
    console.log('User Object to be Inserted:', user);

    // Ensure the user table exists (if not already created)
    console.log("Ensuring user table exists with schema:", userSchema);
await createTable(userSchema);


    // Insert the user record into the database
    console.log('Inserting user into the database...');
    await insertRecord("users", user);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    // Log unexpected errors
    console.error("Unexpected Error:", error.message);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};






// Login endpoint
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Check if the user exists
    const existingUser = await checkRecordExists("users", "email", email);
    if (!existingUser) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare provided password with hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT access token
    const access_token = generateAccessToken(existingUser.userId);

    // Respond with the token and user info
    res.status(200).json({
      userId: existingUser.userId,
      username: existingUser.username,  // Include username in response
      email: existingUser.email,
      access_token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};

module.exports = {
  register,
  login,
};
