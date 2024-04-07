import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants";
import { Request } from "express";
import { getUserById } from "../db/schemas/index";

export type User = {
  id: string;
  name: string;
  email: string;
  token?: string;
};

export async function authenticateUser(
  request: Request
): Promise<User | null> {
  const token = request.headers.authorization?.split(" ")[1];

  if (typeof token === "string") {
    const tokenPayload = verify(token, JWT_SECRET) as JwtPayload;
    const userId = tokenPayload.id;

    return await getUserById(userId);
  }

  return null;
}
