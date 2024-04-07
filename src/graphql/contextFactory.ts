import { Request } from "express";
import { pool } from "../db/db";
import { User } from "../auth/index";
import { Pool } from "pg";
import { authenticateUser } from "../auth/index";

export type GraphQLContext = {
  db: Pool;
  currentUser: User | null;
};

export async function contextFactory(
  request: Request
): Promise<GraphQLContext> {
  return {
    db: pool,
    currentUser: await authenticateUser(request),
  };
}
