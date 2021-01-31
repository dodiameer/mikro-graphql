# Mikro GraphQL

A simple GraphQL API built with PostgreSQL, Typescript, and MikroORM,
to show how to do simple CRUD functionality with relations in GraphQL.

All mutations are private and will only execute if a client provides an "admin secret"
in the Authorization header. By default the secret is "admin-secret", to override it set
the "ADMIN_CLIENT_SHARED_SECRET" environment variable (Don't forget to set it in production!). To disable, remove "Authorized" decorator. To modify, edit `src/utils/middleware/isAdmin.ts` and the context function in `src/index.ts`

## How to run

1. Clone repo and install using `yarn`
2. Change database connection parameters in `src/config/mikro-orm.config.ts`
3. In your teminal, run `yarn db migration:up` to run database migrations (Auto-migrations is buggy and will throw errors so it's best to run it manually)
4. Run `yarn watch` to start up the server (you can also do `yarn watch:ts` and `yarn watch:server` in separate terminals to achieve the same result)

`yarn db` is MikroORM's CLI. Use it to run any commands you want with it.

## Packages/Libraries used

### General

- Typescript
- Apollo Server (Express)
- TypeGraphQL
- MikroORM
- `graphql-fields-to-relations` (Generates relation paths for MikroORM so it knows what to load for your API responses)

### Development only

- Faker (to generate data for seeding the database)
- Nodemon
- Concurrently

## Personal opinion

### MikroORM

a solid, reliable ORM that I would confidently use in a production application.
It integrates well with TypeGraphQL and the entity manager API it provides
is solid and using it feels similar to Microsoft's Entity Framework, which I
personally enjoyed using.

## TypeGraphQL

if you're using Typescript and you're not using this library, you're missing out.
While you might find yourself repeating types, the auto-generated schema
is flawless and the editor integration will be very smooth and help boost developer productivity.
