import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/modules/**/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    database: 'postgres',
    host: 'localhost',
    password: 'example',
    port: 5432,
    user: 'postgres',
  },
})
