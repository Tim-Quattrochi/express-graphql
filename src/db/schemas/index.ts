import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { pool } from "../db";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

dotenv.config();

async function createSchema() {
  const createSchemaSql = fs
    .readFileSync(path.join(__dirname, "user.sql"))
    .toString();
  await pool.query(createSchemaSql);
}

async function getUserById(id: string) {
  const res = await pool.query(
    'SELECT id, name, email FROM "user" WHERE id = $1',
    [id]
  );

  return res.rows[0];
}

async function createUser(
  name: string,
  email: string,
  password: string
) {
  const hashedPassword = await hash(password, 10);

  const res = await pool.query(
    'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hashedPassword]
  );

  return res.rows[0];
}

async function updateUser(id: string, name: string, email: string) {
  const res = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email",
    [name, email, id]
  );
  return res.rows[0];
}

async function deleteUser(id: string) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return { id };
}

async function loginUser(email: string, password: string) {
  const res = await pool.query(
    'SELECT * FROM "user" WHERE email = $1',
    [email]
  );

  if (res.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = res.rows[0];

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials.");
  }

  const token = sign(
    { id: user.id },
    process.env.JWT_SECRET || "default-secret",
    {
      expiresIn: "1h",
    }
  );
  delete user.password;

  return { user, token };
}

export {
  createSchema,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
