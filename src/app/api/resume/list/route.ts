export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const search = searchParams.get('search') || '';
    const batchId = searchParams.get('batchId') || '';
    const minTechnical = parseInt(searchParams.get('minTechnical') || '0');
    const minCoding = parseInt(searchParams.get('minCoding') || '0');
    const minSoftSkills = parseInt(searchParams.get('minSoftSkills') || '0');
    const minJobFit = parseInt(searchParams.get('minJobFit') || '0');

    // Build where clause
    const where: Prisma.CandidateWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { skills: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (batchId) {
      where.batchId = batchId;
    }

    // Score filters
    if (minTechnical > 0 || minCoding > 0 || minSoftSkills > 0 || minJobFit > 0) {
      where.score = {
        ...(minTechnical > 0 && { technicalSkills: { gte: minTechnical } }),
        ...(minCoding > 0 && { codingSkills: { gte: minCoding } }),
        ...(minSoftSkills > 0 && { softSkills: { gte: minSoftSkills } }),
        ...(minJobFit > 0 && { overallJobFit: { gte: minJobFit } }),
      };
    }

    // Build orderBy
    const scoreFields = ['technicalSkills', 'codingSkills', 'softSkills', 'overallJobFit'];
    let orderBy: Prisma.CandidateOrderByWithRelationInput;

    if (scoreFields.includes(sortBy)) {
      orderBy = { score: { [sortBy]: sortOrder } };
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          fileName: true,
          createdAt: true,
          batchId: true,
          score: {
            select: {
              technicalSkills: true,
              codingSkills: true,
              softSkills: true,
              overallJobFit: true,
            },
          },
          skills: {
            select: { name: true, category: true },
            take: 10,
          },
        },
      }),
      prisma.candidate.count({ where }),
    ]);

    return Response.json({
      candidates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List candidates error:', error);
    return Response.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}
