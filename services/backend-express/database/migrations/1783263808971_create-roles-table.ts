import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS roles (
      id SMALLINT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );

    INSERT INTO roles (id, name) 
    VALUES
      (1, 'superadmin'),
      (2, 'admin'),
      (3, 'user')
    ON CONFLICT (id) DO NOTHING;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE IF EXISTS roles;
  `);
}
