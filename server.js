// server.js
import express from "express";
import cors from "cors";
import { generateCharacter } from "./script.js"; // adjust path if needed

const app = express();
app.use(cors());

// API route
app.get("/api/character", async (_req, res) => {
  try {
    const character = await generateCharacter();
    res.json(character);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Character generation failed" });
  }
});

// optional: serve static frontend files from same folder
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname));

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
