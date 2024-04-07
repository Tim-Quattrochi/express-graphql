import { MigrationBuilder } from "node-pg-migrate";

export function up(pgm: MigrationBuilder) {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

  pgm.createTable("users", {
    id: {
      type: "uuid",
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
      primaryKey: true,
    },
    name: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    password: { type: "varchar(255)", notNull: true },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.createTable("posts", {
    id: {
      type: "uuid",
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
      primaryKey: true,
    },
    userId: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    body: { type: "text", notNull: true },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updatedAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.createIndex("posts", "userId");
}
