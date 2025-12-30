import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import generateRoutes from "./routes/generate.routes.js";
import { getTrack } from "./storage/tracks.store.js";

const app = express();

// ✅ CORS (obrigatório para Lovable)
app.use(cors());

// ✅ JSON body
app.use(express.json());

/**
 * POST /generate
 * GET  /generate/:trackId
 */
app.use("/generate", generateRoutes);

/**
 * ✅ ROTA QUE O LOVABLE USA (ROOT)
 * GET /status/:trackId
 */
app.get("/status/:trackId", (req, res) => {
  const { trackId } = req.params;

  const track = getTrack(trackId);

  if (!track) {
    return res.status(404).json({ error: "Track not found" });
  }

  res.json(track);
});

// ✅ Porta Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Mixfy backend rodando na porta ${PORT}`);
});
