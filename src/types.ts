import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

@ObjectType()
export class MutationError {
  @Field()
  field: string;

  @Field()
  error: string;
}
