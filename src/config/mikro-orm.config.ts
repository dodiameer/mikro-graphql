import { MikroORM } from "@mikro-orm/core";
import { isProd } from "../constants";
import { Author } from "../entities/Author";
import { Book } from "../entities/Book";

const MikroORMConfig = {
  entities: [Book, Author],
  dbName: "mikroorm-books",
  type: "postgresql",
  clientUrl: "http://localhost:5432",
  user: "postgres",
  password: "dbpass",
  debug: !isProd,
} as Parameters<typeof MikroORM.init>[0];

export default MikroORMConfig;
