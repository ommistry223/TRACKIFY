import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const recurringTransaction = await prisma.recurringTransaction.findUnique({
    where: { id: parseInt(id) },
  });

  if (!recurringTransaction || recurringTransaction.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.recurringTransaction.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ message: 'Recurring transaction deleted' });
}
