import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Kysely, PostgresAdapter, PostgresIntrospector, PostgresQueryCompiler } from 'kysely';
import kyselyExtension from 'prisma-extension-kysely';
import type { DB } from './generated/types';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  public readonly $kysely: Kysely<DB>;

  constructor() {
    super();

    /**
     * Manually setup Kysely integration with Prisma.
     *
     * @reason
     * Extending PrismaClient for NestJS service breaks default $kysely setup.
     * This recreates the $kysely property on our PrismaService.
     */
    const extension = this.$extends(
      kyselyExtension({
        kysely: (driver) =>
          new Kysely<DB>({
            dialect: {
              createDriver: () => driver,
              createAdapter: () => new PostgresAdapter(),
              createIntrospector: (db) => new PostgresIntrospector(db),
              createQueryCompiler: () => new PostgresQueryCompiler(),
            },
          }),
      }),
    );
    this.$kysely = extension.$kysely;
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      this.logger.fatal(error, 'Error connecting to the database');
    }
  }
}
