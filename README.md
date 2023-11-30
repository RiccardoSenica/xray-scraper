# xray-scrap-test

## Setup

Run docker-compose to start (the database is exposed on port 5432 on localhost, and the credentials are in .env)

```bash
docker-compose up --build
```

## Commands

Run in development mode

```bash
yarn dev
```

Run in production mode

```bash
yarn start
```

Lint the code

```bash
yarn lint
```

Type check the code

```bash
yarn typecheck
```

Format the code

```bash
yarn format
```

Install Git hooks

```bash
yarn prepare
```

Run the migrations

```bash
yarn db:migrate
```

Add a new migration

```bash
yarn db:add-migration
```

Generate the prisma client

```bash
yarn db:generate
```

Wipe the database

```bash
yarn db:reset
```
