import prisma from '../config/db.js';

export const createExpense = async (userId, data) => {
  return await prisma.expense.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getAllExpenses = async (userId, filters = {}) => {
  const { categoryId, startDate, endDate, search } = filters;
  
  const where = { userId };
  if (categoryId) where.categoryId = parseInt(categoryId);
  if (startDate || endDate) {
    where.expenseDate = {};
    if (startDate) where.expenseDate.gte = new Date(startDate);
    if (endDate) where.expenseDate.lte = new Date(endDate);
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return await prisma.expense.findMany({
    where,
    include: { category: true },
    orderBy: { expenseDate: 'desc' },
  });
};

export const getExpenseById = async (id, userId) => {
  return await prisma.expense.findFirst({
    where: { id, userId },
    include: { category: true },
  });
};

export const updateExpense = async (id, userId, data) => {
  return await prisma.expense.update({
    where: { id, userId },
    data,
  });
};

export const deleteExpense = async (id, userId) => {
  return await prisma.expense.delete({
    where: { id, userId },
  });
};
