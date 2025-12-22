# Database

## Drizzle migrations

Migrations are executed automatic.

### Generate a migration from schema changes

```bash
npx drizzle-kit generate --config=src/database/drizzle.config.ts
```

## Generate a custom migration file

```bash
npx drizzle-kit generate --config=src/database/drizzle.config.ts  --custom --name=<<custom-migration-name>>
```


### Generate a custom migration file

```bash
npx drizzle-kit generate --config=src/database/drizzle.config.ts --name=seed-configuration --custom
```


## Manage Databases

```bash
npx drizzle-kit studio --port=3010 --config=src/database/drizzle.config.ts
```
