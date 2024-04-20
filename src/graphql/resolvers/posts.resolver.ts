import { GraphQLResolveInfo } from "graphql";
import { GraphQLContext } from "../contextFactory";

export const postsResolver = {
  Query: {
    async posts(
      _: any,
      args: Record<string, any>,
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ) {
      const { rows } = await context.db.query("SELECT * FROM posts");
      return rows;
    },
    async post(
      _: any,
      args: Record<string, any>,
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ) {
      const { rows } = await context.db.query(
        "SELECT * FROM posts WHERE id = $1",
        [args.id]
      );
      return rows[0];
    },
  },

  Mutation: {
    async createPost(
      _: any,
      { body }: Record<string, any>,
      context: GraphQLContext
    ) {
      if (!context.currentUser) {
        throw new Error("Authentication required");
      }
      // I use quotations around userId because pg makes lower.
      const { rows } = await context.db.query(
        'INSERT INTO posts (body, "userId") VALUES($1, $2) RETURNING *',
        [body, context.currentUser.id]
      );
      return rows[0];
    },

    async deletePost(
      _: any,
      args: Record<string, any>,
      context: GraphQLContext
    ) {
      const postToDelete = await context.db.query(
        'SELECT id, "userId" FROM posts WHERE id = $1',
        [args.id]
      );

      if (postToDelete.rows.length === 0) {
        throw new Error("Post not found");
      }

      if (
        context.currentUser &&
        context.currentUser.id !== postToDelete.rows[0].userId
      ) {
        throw new Error("User not authorized to delete this post");
      }

      await context.db.query("DELETE FROM posts WHERE id = $1", [
        args.id,
      ]);

      return "Post deleted successfully";
    },

    async updatePost(
      _: any,
      { id, body }: Record<string, any>,
      context: GraphQLContext
    ) {
      const postToUpdate = await context.db.query(
        'SELECT id, "userId" FROM posts WHERE id = $1',
        [id]
      );

      if (postToUpdate.rows.length === 0) {
        throw new Error("Post not found");
      }

      if (
        context.currentUser &&
        context.currentUser.id !== postToUpdate.rows[0].userId
      ) {
        throw new Error("User not authorized to update this post");
      }

      const { rows } = await context.db.query(
        "UPDATE posts SET body = $1 WHERE id = $2 RETURNING *",
        [body, id]
      );

      return rows[0];
    },
  },
};
