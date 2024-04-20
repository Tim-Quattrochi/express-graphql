import { readFileSync } from "fs";
import path from "path";
import { userResolver } from "./resolvers/user.resolver";
import { postsResolver } from "./resolvers/posts.resolver";

const userTypes = readFileSync(
  path.join(__dirname, "./typeDefs/user.graphql"),
  { encoding: "utf-8" }
);

const postTypes = readFileSync(
  path.join(__dirname, "./typeDefs/post.graphql"),
  { encoding: "utf-8" }
);

export const typeDefs = userTypes + postTypes;

export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...postsResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postsResolver.Mutation,
  },
};
