import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * @function createUser - Handles user registration by creating and saving a new user to the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function createUser(req, res) {
  const { fullName, email, username, password, role } = req.body;
  try {
    const user = new User({ username, password, role, fullName, email });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("User registration failed:", error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
}

/**
 * @function login - Authenticates a user by verifying their credentials and issuing a JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function login(req, res) {
  const { email, username, password } = req.body;
  
  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
}

/**
 * @function getUserList - Retrieves a list of users with selected fields
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getUserList(req, res) {
  try {
    const users = await User.find({}, 'username fullName email role createdBy createdDate');
    res.json({ users });
  } catch (error) {
    console.error("Failed to fetch user list:", error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
}

/**
 * @function authorize - Middleware to restrict access based on user roles
 * @param {Array} roles - Array of allowed roles for access
 * @returns {Function} Middleware function
 */
export const authorize = (roles) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header is missing' });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!roles.includes(decoded.role)) return res.status(403).json({ message: 'Forbidden' });
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authorization failed:", error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
