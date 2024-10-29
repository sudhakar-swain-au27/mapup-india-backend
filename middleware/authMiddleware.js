import { verify } from 'jsonwebtoken';

/**
 * @function auth - Middleware to authenticate and authorize users based on roles
 * @param {Array} roles - Array of roles allowed to access the resource
 * @returns {Function} Middleware function
 */
const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

export default auth;
