import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Add user info from token to the request object
      req.user = decoded;

      next(); // Move to the actual controller function
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};