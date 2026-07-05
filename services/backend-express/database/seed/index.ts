import { getPool } from "../../src/database/connect-db.js";
import { seedUsers } from "./user-seed.js";
import type { PoolClient } from "pg";

const seeders = [
  seedUsers,
];

const pool = getPool();
let client: PoolClient | undefined;
let transactionStarted = false;

try {
  client = await pool.connect();

  for (const seed of seeders) {
    await client.query("BEGIN");
    transactionStarted = true;

    await seed(client);

    await client.query("COMMIT");
    transactionStarted = false;

    console.log(`${seed.name} completed.`);
  }

} catch (error) {
  if (client && transactionStarted) {
    await client.query("ROLLBACK");
  }

  console.error("Seeding failed:", error);
  process.exitCode = 1;
} finally {
  client?.release();
  await pool.end();
}
