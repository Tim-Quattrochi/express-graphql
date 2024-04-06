import {
  getUserById,
  createUser,
  deleteUser,
} from "../../db/schemas";
import { GraphQLResolveInfo } from "graphql";

export const userResolver = {
  Query: {
    async user(
      _: any,
      args: Record<string, any>,
      context: any,
      info: GraphQLResolveInfo
    ) {
      return await getUserById(args.id);
    },
  },
  Mutation: {
    async createUser(_: any, { input }: Record<string, any>) {
      return await createUser(
        input.name,
        input.email,
        input.password
      );
    },

    async deleteUser(_: any, args: Record<string, any>) {
      return await deleteUser(args.id);
    },
  },
};
