import { Pool } from "pg";
import { ConnectionConfig } from "pg";
import {
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  DB_USER,
} from "../utils/constants";

export const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: 5432,
});
