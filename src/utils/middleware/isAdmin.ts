import { AuthChecker } from "type-graphql";
import { MyContext } from "../../types";

const isAdmin: AuthChecker<MyContext> = async ({ context }) => {
  return context.isAnAdminClient;
};

export default isAdmin;
