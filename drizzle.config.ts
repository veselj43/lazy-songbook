import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/modules/**/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'songbook.db',
  },
})
