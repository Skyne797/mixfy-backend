import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createTrack, updateTrack } from "../storage/tracks.store.js";


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;

    const trackId = `mixfy_${uuidv4()}`;

    // 1️⃣ cria track imediatamente
    await createTrack({
      id: trackId,
      status: "processing",
      prompt,
      style,
      duration,
      attempts: 0,
    });

    // 2️⃣ responde IMEDIATO
    res.json({
      status: "processing",
      trackId,
      estimatedTime: 15,
    });

    // 3️⃣ geração em background
    generateMusic(trackId, { prompt, style, duration })
      .then((audioUrl) => {
        updateTrack(trackId, {
          status: "completed",
          audioUrl,
        });
      })
      .catch((err) => {
        updateTrack(trackId, {
          status: "error",
          error: err.message || "Erro ao gerar música",
        });
      });

  } catch (error) {
    console.error("Erro no /generate:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Erro ao gerar musica" });
    }
  }
});

export default router;
