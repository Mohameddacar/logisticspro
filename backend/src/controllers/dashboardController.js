import prisma from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(`[Dashboard] Fetching stats for user: ${userId}`);

    // Fetch aggregates in parallel for performance
    const [totalIncome, totalExpenses] = await Promise.all([
      prisma.income.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
      })
    ]);

    // Fetch latest transactions
    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({
        where: { userId },
        take: 10,
        orderBy: { incomeDate: 'desc' },
        include: { category: true }
      }),
      prisma.expense.findMany({
        where: { userId },
        take: 10,
        orderBy: { expenseDate: 'desc' },
        include: { category: true }
      })
    ]);

    const incomeVal = Number(totalIncome?._sum?.amount || 0);
    const expenseVal = Number(totalExpenses?._sum?.amount || 0);

    const combined = [
      ...incomes.map(i => ({ 
        id: i.id,
        title: i.title,
        amount: Number(i.amount),
        date: i.incomeDate,
        type: 'income',
        category: i.category,
        categoryId: i.categoryId,
        description: i.description
      })),
      ...expenses.map(e => ({ 
        id: e.id,
        title: e.title,
        amount: Number(e.amount),
        date: e.expenseDate,
        type: 'expense',
        category: e.category,
        categoryId: e.categoryId,
        description: e.description
      }))
    ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

    // Fetch chart data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const [monthlyIncomes, monthlyExpenses] = await Promise.all([
      prisma.income.groupBy({
        by: ['incomeDate'],
        where: { 
          userId,
          incomeDate: { gte: sixMonthsAgo }
        },
        _sum: { amount: true }
      }),
      prisma.expense.groupBy({
        by: ['expenseDate'],
        where: { 
          userId,
          expenseDate: { gte: sixMonthsAgo }
        },
        _sum: { amount: true }
      })
    ]);

    // Format chart data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const monthLabel = months[d.getMonth()];
      
      const incomeForMonth = monthlyIncomes
        .filter(idx => new Date(idx.incomeDate).getMonth() === d.getMonth())
        .reduce((sum, curr) => sum + Number(curr._sum.amount), 0);

      const expenseForMonth = monthlyExpenses
        .filter(edx => new Date(edx.expenseDate).getMonth() === d.getMonth())
        .reduce((sum, curr) => sum + Number(curr._sum.amount), 0);

      chartData.push({ month: monthLabel, income: incomeForMonth, expense: expenseForMonth });
    }

    console.log(`[Dashboard] Stats calculated: Income=${incomeVal}, Expenses=${expenseVal}`);

    res.json({
      success: true,
      data: {
        totalIncome: incomeVal,
        totalExpenses: expenseVal,
        balance: incomeVal - expenseVal,
        recentTransactions: combined,
        chartData
      }
    });
  } catch (error) {
    console.error(`[Dashboard Error] ${error.message}`, error);
    next(error);
  }
};
