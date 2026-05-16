import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import protect from '../middlewares/authMiddleware.js';
import checkPermission from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(checkPermission('expenses.add'), expenseController.createExpense)
  .get(checkPermission('expenses.view'), expenseController.getExpenses);

router.route('/:id')
  .get(checkPermission('expenses.view'), expenseController.getExpense)
  .put(checkPermission('expenses.edit'), expenseController.updateExpense)
  .delete(checkPermission('expenses.delete'), expenseController.deleteExpense);

export default router;
