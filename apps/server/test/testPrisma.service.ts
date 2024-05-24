import { Injectable } from '@nestjs/common';
import { PrismaService } from '@server/prisma/prisma.service';

@Injectable()
export class TestPrismaService {
  private static instance: PrismaService;

  static getInstance(): PrismaService {
    if (!TestPrismaService.instance) {
      TestPrismaService.instance = new PrismaService();
    }
    return TestPrismaService.instance;
  }
}
