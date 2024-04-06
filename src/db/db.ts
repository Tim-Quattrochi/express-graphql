import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export default client;
