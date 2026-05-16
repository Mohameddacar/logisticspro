import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import protect from '../middlewares/authMiddleware.js';
import checkPermission from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.get('/stats', protect, checkPermission('dashboard.view'), getDashboardStats);

export default router;
