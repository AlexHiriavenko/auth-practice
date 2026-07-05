import express from "express";
import { loadEnvFile } from "node:process";

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

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});