import * as expenseService from '../services/expenseService.js';

export const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.user.id, req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseService.getAllExpenses(req.user.id, req.query);
    res.json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};

export const getExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, req.user.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    await expenseService.deleteExpense(req.params.id, req.user.id);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    next(error);
  }
};
