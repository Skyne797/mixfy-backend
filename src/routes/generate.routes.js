import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createTrack,
  updateTrack,
  getTrack
} from "../storage/tracks.store.js";

const router = express.Router();

/**
 * POST /generate
 * Cria uma nova música
 */
router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;

    // gera o ID único da música
    const trackId = `mixfy_${uuidv4()}`;

    // cria a track como "processing"
    createTrack(trackId);

    // responde imediatamente para o frontend
    res.json({
      status: "processing",
      trackId,
      estimatedTime: 10,
    });

    // 🔥 SIMULA a geração da música (pipeline)
    setTimeout(() => {
      updateTrack(trackId, {
        status: "completed",
        audioUrl: "https://mixfy.fake/audio-demo.mp3",
      });
    }, 8000);

  } catch (error) {
    console.error("Erro no POST /generate:", error);
    res.status(500).json({ error: "Erro ao gerar música" });
  }
});

/**
 * GET /generate/:trackId
 * Consulta o status da música
 */
router.get("/:trackId", (req, res) => {
  const { trackId } = req.params;

  const track = getTrack(trackId);

  if (!track) {
    return res.status(404).json({ error: "Track not found" });
  }

  res.json(track);
});

export default router;



