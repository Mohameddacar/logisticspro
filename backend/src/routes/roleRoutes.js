import express from 'express';
import { getRoles, getPermissions, updateRolePermissions } from '../controllers/roleController.js';
import protect from '../middlewares/authMiddleware.js';
import checkPermission from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.get('/', protect, checkPermission('users.view'), getRoles);
router.get('/permissions', protect, checkPermission('users.view'), getPermissions);
router.post('/permissions', protect, checkPermission('users.edit'), updateRolePermissions);

export default router;
