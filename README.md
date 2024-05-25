This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Introduction

Next.js - RBAC (Role Based Access Control) helps to setup a application, with roles and permissions. This boilerplate ships with RBAC database schema, utility functions for RBAC and very minimal or no components and styles.

Main functionalities are as follows,

1. Setup Teams
2. Setup Roles & Permissions for teams
3. Assign roles to users

![RBAC Table structure](https://raw.githubusercontent.com/justin22/nextjs-rbac/main/db-schema.png)

## Dependencies
1. Drizzle - Drizzle is a database schema migration tool.
2. lucia - Lucia is a auth library, which helps to setup authentication easily.

Following is an example for Postgres. Once you have a Database setup, add `DATABASE_URL` to your env file. 

```
DATABASE_URL"postgresql://mydbuser:123@localhost:5432/mydb?schema=public"
```

### Run migrations

Once database setup is done, you can run the migration using prisma command. 
```
npx prisma migrate dev
```

## Start dev server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Application flow. 

![RBAC Table structure](https://raw.githubusercontent.com/justin22/nextjs-rbac/main/application-flow.png)

## Todo
- [x] Integrate auth
- [x]  Setup teams, roles and permissions
- [ ]  Create guard (something like `can(user, 'PERMISSION_NAME')`)
- [ ]  Ability to invite users, accept/decline invites
- [ ]  Switch teams
- [ ]  Unit tests