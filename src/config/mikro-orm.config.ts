import { MikroORM } from "@mikro-orm/core";
import { isProd } from "../constants";
import { Author } from "../entities/Author";
import { Book } from "../entities/Book";
import path from "path";

const ORM_MIGRATIONS_PATH = path.join("..", "migrations");

const MikroORMConfig = {
  entities: [Book, Author],
  type: "postgresql",
  clientUrl: isProd
    ? process.env.DATABASE_URL
    : "http://postgres:dbpass@localhost:5432",
  debug: !isProd,
  ...(!isProd ? { dbName: "mikroorm-books" } : {}),
  migrations: { path: ORM_MIGRATIONS_PATH, disableForeignKeys: false },
} as Parameters<typeof MikroORM.init>[0];

export default MikroORMConfig;
