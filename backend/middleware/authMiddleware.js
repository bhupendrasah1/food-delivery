import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Request Headers (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <TOKEN_STRING>"
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user details from PostgreSQL (excluding password for security)
      const userResult = await pool.query(
        'SELECT id, name, email, role FROM users WHERE id = $1',
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found ' });
      }

      // Attach the user data directly to the request object so next controllers can use it
      req.user = userResult.rows[0];
      
      // Move to the next controller function
      next();
      
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token ' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided ' });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};