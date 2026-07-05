import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function createPool() {
  return new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT ?? 5432),
  });
}

export function getPool() {
  if (!pool) {
    pool = createPool();
  }

  return pool;
}

export async function connectToDatabase()  {
  try {
    await getPool().query("SELECT 1");
    console.log("Connected to the database successfully.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message) {
      console.error("Error connecting to the database: check is docker container running and .env file is configured correctly");
    } else {
        console.error("Error connecting to the database:", message);
    }
    process.exit(1);
  }
};