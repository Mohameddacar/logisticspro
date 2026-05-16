import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  getUsers, 
  updateRole, 
  toggleStatus, 
  removeUser 
} from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
import checkPermission from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes
router.get('/', protect, checkPermission('users.view'), getUsers);
router.put('/role', protect, checkPermission('users.edit'), updateRole);
router.put('/status', protect, checkPermission('users.edit'), toggleStatus);
router.delete('/:id', protect, checkPermission('users.delete'), removeUser);

export default router;
