import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  isAnAdminClient: boolean;
};

@ObjectType()
export class MutationError {
  @Field()
  field: string;

  @Field()
  error: string;
}
