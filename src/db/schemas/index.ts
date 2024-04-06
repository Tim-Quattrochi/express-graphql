import fs from "fs";
import path from "path";
import client from "../db";
import bcrypt from "bcrypt";

async function createSchema() {
  const createSchemaSql = fs
    .readFileSync(path.join(__dirname, "user.sql"))
    .toString();
  await client.query(createSchemaSql);
}

async function dropSchema() {
  const dropSchemaSql = 'DROP TABLE IF EXISTS "user"';
  await client.query(dropSchemaSql);
}

async function getUserById(id: string) {
  const res = await client.query(
    'SELECT * FROM "user" WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

async function createUser(
  name: string,
  email: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const res = await client.query(
    'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  );

  return res.rows[0];
}

async function updateUser(id: string, name: string, email: string) {
  const res = await client.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );
  return res.rows[0];
}

async function deleteUser(id: string) {
  await client.query("DELETE FROM users WHERE id = $1", [id]);
}

export {
  createSchema,
  dropSchema,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
