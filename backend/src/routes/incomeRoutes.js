import express from 'express';
import * as incomeController from '../controllers/incomeController.js';
import protect from '../middlewares/authMiddleware.js';
import checkPermission from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(checkPermission('income.add'), incomeController.createIncome)
  .get(checkPermission('income.view'), incomeController.getIncomes);

router.route('/:id')
  .get(checkPermission('income.view'), incomeController.getIncome)
  .put(checkPermission('income.edit'), incomeController.updateIncome)
  .delete(checkPermission('income.delete'), incomeController.deleteIncome);

export default router;
