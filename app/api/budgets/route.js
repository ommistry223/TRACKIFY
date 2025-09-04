import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const budgets = await prisma.budget.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json(budgets);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { category, amount } = await request.json();

  if (!category || !amount) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const budget = await prisma.budget.create({
    data: {
      category,
      amount: parseFloat(amount),
      userId: session.user.id,
    },
  });

  return NextResponse.json(budget);
}
