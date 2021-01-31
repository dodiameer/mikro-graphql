import { Authorized, Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query((returns) => String)
  @Authorized()
  async adminSecret(): Promise<string> {
    return "STONKS";
  }
}
