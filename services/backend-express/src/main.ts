import { loadEnvFile } from "node:process";
import express from "express";
import router from "./routes/index.js";
import { connectToDatabase } from "./database/connect-db.js";

try {
  loadEnvFile();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Error loading .env file, use .env.example as a template:", message);
  process.exit(1);
}

const app = express();

const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use("/api", router);

await connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});