import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return NextResponse.json(transactions);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount, description, type, category, date } = await request.json();

  if (!amount || !description || !type || !category || !date) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      description,
      type,
      category,
      date: new Date(date),
      userId: session.user.id,
    },
  });

  return NextResponse.json(transaction);
}
