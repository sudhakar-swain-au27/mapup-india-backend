import { Router } from 'express';
import { createUser, login, getUserList } from '../controllers/authController.js';

const router = Router();

/**
 * @route   POST /api/auth/createUser
 * @desc    Register a new user
 * @access  Public
 */
router.post('/createUser', createUser);

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/user-lists
 * @desc    Get list of all users
 * @access  Private (requires authentication)
 */
router.get('/user-lists', getUserList);

export default router;
