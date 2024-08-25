import {
  Module,
  DefaultContext,
  getWriteNDK,
  DirectOutbox,
  requiredEnvVar,
} from '@lawallet/module';
import { PrismaClient } from '@prisma/client';

type Context = DefaultContext & { prisma: PrismaClient };

const context: Context = {
  outbox: new DirectOutbox(getWriteNDK()),
  prisma: new PrismaClient(),
};

const module = Module.build<Context>({
  context,
  nostrPath: `${import.meta.dirname}/nostr`,
  port: Number(requiredEnvVar('PORT')),
  restPath: `${import.meta.dirname}/rest`,
});

void module.start();
