import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import type { PoolClient } from "pg";

const USERS_COUNT = 98;
const MOCK_PASSWORD = "123123123";
const SALT_ROUNDS = 8;

function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(seed)}`;
}

export async function seedUsers(client: PoolClient) {
  const existingUsers = await client.query("SELECT COUNT(*) FROM users");

  if (Number(existingUsers.rows[0].count) > 0) {
    console.log("Seed skipped: users table is not empty.");
    return;
  }

  faker.seed(123);

  const passwordHash = await bcrypt.hash(MOCK_PASSWORD, SALT_ROUNDS);

  // Insert superadmin

  await client.query(
    `
      INSERT INTO users (username, email, password_hash, role_id, avatar_url)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      "superadmin",
      "superadmin@example.com",
      passwordHash,
      1,
      getAvatarUrl(faker.string.uuid()),
    ],
  );

  // Insert admin

  await client.query(
    `
      INSERT INTO users (username, email, password_hash, role_id, avatar_url)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      "admin",
      "admin@example.com",
      passwordHash,
      2,
      getAvatarUrl(faker.string.uuid()),
    ],
  );

  // Insert mock users

  const usernames = faker.helpers.uniqueArray(
    () => faker.internet.username().toLowerCase(),
    USERS_COUNT,
  );

  const emails = faker.helpers.uniqueArray(
    () => faker.internet.email().toLowerCase(),
    USERS_COUNT,
  );

  for (let i = 1; i <= USERS_COUNT; i++) {
    const username = `${usernames[i - 1]}`;
    const email = `${emails[i - 1]}`;
    const avatarUrl = getAvatarUrl(faker.string.uuid());

    await client.query(
      `
        INSERT INTO users (username, email, password_hash, role_id, avatar_url)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `,
      [
        username,
        email,
        passwordHash,
        3,
        avatarUrl,
      ],
    );
  }

  console.log("Seed completed.");
  console.log("Superadmin login: superadmin@example.com");
  console.log("Admin login: admin@example.com");
  console.log(`Mock password: ${MOCK_PASSWORD}`);
}
