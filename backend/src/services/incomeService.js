import prisma from '../config/db.js';

export const createIncome = async (userId, data) => {
  return await prisma.income.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getAllIncomes = async (userId, filters = {}) => {
  const { categoryId, startDate, endDate, search } = filters;
  
  const where = { userId };
  if (categoryId) where.categoryId = parseInt(categoryId);
  if (startDate || endDate) {
    where.incomeDate = {};
    if (startDate) where.incomeDate.gte = new Date(startDate);
    if (endDate) where.incomeDate.lte = new Date(endDate);
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return await prisma.income.findMany({
    where,
    include: { category: true },
    orderBy: { incomeDate: 'desc' },
  });
};

export const getIncomeById = async (id, userId) => {
  return await prisma.income.findFirst({
    where: { id, userId },
    include: { category: true },
  });
};

export const updateIncome = async (id, userId, data) => {
  return await prisma.income.update({
    where: { id, userId },
    data,
  });
};

export const deleteIncome = async (id, userId) => {
  return await prisma.income.delete({
    where: { id, userId },
  });
};
