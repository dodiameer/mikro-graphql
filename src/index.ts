import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { MikroORM } from "@mikro-orm/core";
import MikroORMConfig from "./config/mikro-orm.config";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolvers/BookResolver";
import { isProd } from "./constants";
import { AuthorResolver } from "./resolvers/AuthorResolver";
import isAdmin from "./utils/middleware/isAdmin";

const main = async () => {
  /* ORM Initialization */
  const orm = await MikroORM.init(MikroORMConfig);
  try {
    await orm.getMigrator().up();
  } catch (e) {
    console.error(e);
    console.log(`
    ----------------------------------------------------
      Migration failed. Please run migrations manually
    ----------------------------------------------------
    `);
  }

  /* Server Initialization */
  const app = express();
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [BookResolver, AuthorResolver],
      authChecker: isAdmin,
    }),
    context: ({ req }) => {
      const adminClientSharedSecret =
        process.env.ADMIN_CLIENT_SHARED_SECRET ?? "admin-secret";
      const header = req.header("Authorization");
      const token = header?.split("Bearer ")[1] ?? null;
      const isAnAdminClient = token === adminClientSharedSecret;
      return {
        em: orm.em,
        isAnAdminClient,
      };
    },
  });
  server.applyMiddleware({ app });

  if (!isProd) {
    const runSeed = await import("./utils/runSeed");
    await runSeed.default(orm.em);
  }

  const PORT = process.env.PORT ?? 4000;
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

main().catch((e) => console.error(e));
