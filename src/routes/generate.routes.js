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
 */
router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;

    const trackId = `mixfy_${uuidv4()}`;

    // cria track imediatamente
    createTrack(trackId, {
      status: "processing",
      prompt,
      style,
      duration,
      attempts: 0,
    });

    // responde rápido (evita timeout)
    res.json({
      status: "processing",
      trackId,
      estimatedTime: 15,
    });

    // simula geração em background
    setTimeout(() => {
      updateTrack(trackId, {
        status: "completed",
        audioUrl: "https://link_do_audio.mp3",
      });
    }, 5000);

  } catch (error) {
    console.error("Erro no /generate:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Erro ao gerar musica" });
    }
  }
});

/**
 * GET /generate/status/:trackId
 */
router.get("/status/:trackId", (req, res) => {
  const { trackId } = req.params;

  const track = getTrack(trackId);

  if (!track) {
    return res.status(404).json({ error: "Track not found" });
  }

  res.json(track);
});

export default router;

