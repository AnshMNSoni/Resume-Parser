export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const batch = await prisma.batchUpload.findUnique({
      where: { id },
      include: {
        candidates: {
          select: {
            id: true,
            name: true,
            email: true,
            fileName: true,
            score: {
              select: {
                technicalSkills: true,
                codingSkills: true,
                softSkills: true,
                overallJobFit: true,
              },
            },
          },
        },
      },
    });

    if (!batch) {
      return Response.json({ error: 'Batch not found' }, { status: 404 });
    }

    return Response.json({ batch });
  } catch (error) {
    console.error('Get batch error:', error);
    return Response.json({ error: 'Failed to fetch batch' }, { status: 500 });
  }
}
