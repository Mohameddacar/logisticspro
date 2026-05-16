import * as incomeService from '../services/incomeService.js';

export const createIncome = async (req, res, next) => {
  try {
    const income = await incomeService.createIncome(req.user.id, req.body);
    res.status(201).json({ success: true, data: income });
  } catch (error) {
    next(error);
  }
};

export const getIncomes = async (req, res, next) => {
  try {
    const incomes = await incomeService.getAllIncomes(req.user.id, req.query);
    res.json({ success: true, data: incomes });
  } catch (error) {
    next(error);
  }
};

export const getIncome = async (req, res, next) => {
  try {
    const income = await incomeService.getIncomeById(req.params.id, req.user.id);
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    res.json({ success: true, data: income });
  } catch (error) {
    next(error);
  }
};

export const updateIncome = async (req, res, next) => {
  try {
    const income = await incomeService.updateIncome(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: income });
  } catch (error) {
    next(error);
  }
};

export const deleteIncome = async (req, res, next) => {
  try {
    await incomeService.deleteIncome(req.params.id, req.user.id);
    res.json({ success: true, message: 'Income deleted' });
  } catch (error) {
    next(error);
  }
};
