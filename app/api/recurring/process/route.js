import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const recurringTransactions = await prisma.recurringTransaction.findMany({
    where: {
      userId: session.user.id,
      startDate: {
        lte: new Date(),
      },
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } },
      ],
    },
  });

  for (const rt of recurringTransactions) {
    const lastTransaction = await prisma.transaction.findFirst({
      where: {
        description: rt.description,
        userId: session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    let nextDueDate = new Date(rt.startDate);
    if (lastTransaction) {
      nextDueDate = new Date(lastTransaction.date);
      if (rt.frequency === 'daily') {
        nextDueDate.setDate(nextDueDate.getDate() + 1);
      } else if (rt.frequency === 'weekly') {
        nextDueDate.setDate(nextDueDate.getDate() + 7);
      } else if (rt.frequency === 'monthly') {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      } else if (rt.frequency === 'yearly') {
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
      }
    }

    if (nextDueDate <= new Date()) {
      await prisma.transaction.create({
        data: {
          description: rt.description,
          amount: rt.amount,
          type: rt.type,
          category: rt.category,
          date: nextDueDate,
          userId: session.user.id,
        },
      });
    }
  }

  return NextResponse.json({ message: 'Recurring transactions processed' });
}
