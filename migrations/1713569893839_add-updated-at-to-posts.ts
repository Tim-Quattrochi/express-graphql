import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW."updatedAt" = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger("posts", "set_timestamp");
  pgm.sql("DROP FUNCTION trigger_set_timestamp");
}
