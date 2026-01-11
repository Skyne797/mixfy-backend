import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createTrack,
  updateTrack,
  getTrackById,
} from "../storage/tracks.store.js";
import { generateMusicWithVoice } from "../services/musicapi.service.js";

const router = express.Router();

/**
 * POST /generate
 */
router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;

    const trackId = `mixfy_${uuidv4()}`;

    // 1️⃣ cria imediatamente
    await createTrack({
      id: trackId,
      status: "processing",
      prompt,
      style,
      duration,
      attempts: 0,
    });

    // 2️⃣ responde rápido
    res.json({
      status: "processing",
      trackId,
      estimatedTime: 20,
    });

    // 3️⃣ geração em background
    generateMusicWithVoice({ prompt, style, duration })
      .then((audioUrl) => {
        updateTrack(trackId, {
          status: "completed",
          audioUrl,
        });
      })
      .catch((err) => {
        updateTrack(trackId, {
          status: "error",
          error: err.message,
        });
      });

  } catch (error) {
    console.error("Erro no /generate:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Erro ao gerar música" });
    }
  }
});

/**
 * GET /generate/status/:id
 */
router.get("/status/:id", async (req, res) => {
  const { id } = req.params;

  const track = await getTrackById(id);

  if (!track) {
    return res.status(404).json({ error: "Track not found" });
  }

  res.json(track);
});

export default router;
