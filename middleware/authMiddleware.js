const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the "Authorization" header
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token and get the decoded data
    req.user = { userId: decoded.userId }; // Attach the decoded user data to the request object
    next(); // Call next() to continue to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

 
};

module.exports = authenticateUser;


