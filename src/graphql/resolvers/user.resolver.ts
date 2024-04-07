import {
  getUserById,
  createUser,
  deleteUser,
  loginUser,
} from "../../db/schemas";
import { GraphQLResolveInfo } from "graphql";
import { GraphQLContext } from "../contextFactory";

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
    me: async (
      parent: unknown,
      args: {},
      context: GraphQLContext
    ) => {
      if (context.currentUser === null) {
        throw new Error("User not authenticated");
      }
      return context.currentUser;
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

    async deleteUser(
      _: any,
      args: Record<string, any>,
      context: GraphQLContext
    ) {
      const userToDelete = await context.db.query(
        "SELECT id FROM users WHERE id = $1",
        [args.id]
      );
      if (
        context.currentUser &&
        context.currentUser.id !== userToDelete.rows[0].id
      ) {
        throw new Error("User not authorized to delete this user");
      }
      await deleteUser(args.id);
      return "User deleted successfully";
    },

    async login(_: any, { input }: Record<string, any>) {
      return await loginUser(input.email, input.password);
    },
  },
};
