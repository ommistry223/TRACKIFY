import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const recurringTransactions = await prisma.recurringTransaction.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json(recurringTransactions);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { description, amount, type, category, frequency, startDate } = await request.json();

  if (!description || !amount || !type || !category || !frequency || !startDate) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const recurringTransaction = await prisma.recurringTransaction.create({
    data: {
      description,
      amount: parseFloat(amount),
      type,
      category,
      frequency,
      startDate: new Date(startDate),
      userId: session.user.id,
    },
  });

  return NextResponse.json(recurringTransaction);
}
