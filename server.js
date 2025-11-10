import express from "express";
import cors from "cors";
import { generateCharacter } from "./script.js";

const app = express();
app.use(cors());

app.get("/api/character", async (req, res) => {
  try {
    const character = await generateCharacter();
    res.json(character);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Character generation failed." });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
