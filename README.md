Lazy songbook is app for managing and sharing songs while you play.

App here: TODO.

# Core technology

- [Nuxt](https://nuxt.com/)
- [Nuxt UI](https://ui.nuxt.com/)

# Setup

Make sure to install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Tools

- drizzle-kit (`pn drizzle-kit <command>`)
- sql-studio (standalone install)

## Database

The app uses Postgres through Drizzle. Create config from [drizzle.config.example.ts](./drizzle.config.example.ts).

```bash
cp drizzle.config.example.ts drizzle.config.local.ts
cp drizzle.config.example.ts drizzle.config.production.ts
```

Postgres connection string format: `postgres://USER:PASSWORD@HOST:PORT/DATABASE`

For production, assuming the Postgres instance already exists:

1. Create or choose an application database and an application user.
2. Grant that user privileges on the database/schema used by the app.
3. Set `DATABASE_URL` in the production runtime environment.
4. Apply the current schema:

```bash
pnpm drizzle-kit migrate --config=drizzle.config.production.ts
```

Use SSL parameters in `DATABASE_URL` if your provider requires them, for example `?sslmode=require`.

# Production deploy

```bash
# build
pnpm build
# run migrations
pnpm drizzle-kit migrate --config=drizzle.config.production.ts
# start
pnpm start
```
