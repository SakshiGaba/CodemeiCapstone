const dotenv = require('dotenv');
const { z } = require('zod');

// Load .env once, early.
dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  PORT: z.coerce.number().int().positive().optional().default(5000),
  // Allow overriding DB path for test runs/CI if needed
  DB_PATH: z.string().min(1).optional().default('db/app.db'),
  // CORS: allow configuring a single origin (or leave undefined to allow all in dev)
  CORS_ORIGIN: z.string().min(1).optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

module.exports = {
  env: {
    nodeEnv: parsed.data.NODE_ENV || 'development',
    port: parsed.data.PORT,
    dbPath: parsed.data.DB_PATH,
    corsOrigin: parsed.data.CORS_ORIGIN,
  },
};
