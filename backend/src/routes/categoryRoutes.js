import express from 'express';
import prisma from '../config/db.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/income', async (req, res) => {
  const categories = await prisma.incomeCategory.findMany();
  res.json({ success: true, data: categories });
});

router.get('/expense', async (req, res) => {
  const categories = await prisma.expenseCategory.findMany();
  res.json({ success: true, data: categories });
});

export default router;
