import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createTrack, updateTrack } from "../storage/tracks.store.js";
import { generateMusicWithVoice } from "../services/musicapi.service.js";

const router = express.Router();

/**
 * POST /generate
 */
router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;

    const trackId = `mixfy_${uuidv4()}`;

    // 1️⃣ cria imediatamente no banco
    await createTrack({
      id: trackId,
      status: "processing",
      prompt,
      style,
      duration,
      attempts: 0,
    });

    // 2️⃣ responde IMEDIATO (sem timeout)
    res.json({
      status: "processing",
      trackId,
      estimatedTime: 20,
    });

    // 3️⃣ geração real em background
    generateMusicWithVoice({
      prompt,
      style,
      duration,
    })
      .then((audioUrl) => {
        updateTrack(trackId, {
          status: "completed",
          audioUrl,
        });
      })
      .catch((err) => {
        console.error("Erro MusicAPI:", err);
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

export default router;

