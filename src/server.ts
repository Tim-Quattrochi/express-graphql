import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool as db } from "./db/db";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import { resolvers, typeDefs } from "./graphql";
import { contextFactory } from "./graphql/contextFactory";

dotenv.config();

interface AuthContext {
  token?: String;
}

const app = express();

const httpServer = http.createServer(app);

async function bootstrapServer() {
  await db.connect();

  const server = new ApolloServer<AuthContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  //middleware
  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => contextFactory(req),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );
  console.log(
    `Server ready at http://localhost:${process.env.PORT}/`
  );
}

bootstrapServer();
