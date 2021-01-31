import { MikroORM } from "@mikro-orm/core";
import { isProd } from "../constants";
import { Author } from "../entities/Author";
import { Book } from "../entities/Book";

const MikroORMConfig = {
  entities: [Book, Author],
  dbName: "mikroorm-books",
  type: "postgresql",
  clientUrl: isProd
    ? process.env.DATABASE_URL
    : "http://postgres:dbpass@localhost:5432",
  debug: !isProd,
} as Parameters<typeof MikroORM.init>[0];

export default MikroORMConfig;
