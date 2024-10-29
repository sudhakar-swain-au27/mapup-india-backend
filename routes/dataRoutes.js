// dataRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
import { uploadCSVStream, getPaginatedData } from '../controllers/dataController.js';

const router = express.Router();

/**
 * @route   POST /api/data/upload-file
 * @desc    Upload CSV files and process data in batches
 * @access  Public
 */
router.post('/upload-file', upload.array('file'), uploadCSVStream);

/**
 * @route   GET /api/data/file-data
 * @desc    Retrieve paginated data from uploaded files
 * @access  Public
 */
router.get('/file-data', getPaginatedData);

export default router;
