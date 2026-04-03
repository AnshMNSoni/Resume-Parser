export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        score: true,
        skills: true,
        experiences: true,
        educations: true,
      },
    });

    if (!candidate) {
      return Response.json({ error: 'Candidate not found' }, { status: 404 });
    }

    return Response.json({ candidate });
  } catch (error) {
    console.error('Get candidate error:', error);
    return Response.json({ error: 'Failed to fetch candidate' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.candidate.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete candidate error:', error);
    return Response.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
}
