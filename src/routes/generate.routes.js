import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createTrack, updateTrack } from "../storage/tracks.store.js";
import { generateMusicGen } from "../services/musicgen.service.js";

const router = express.Router();

/**
 * POST /generate
 * Cria uma música instrumental usando MusicGen (Replicate)
 */
router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration = 15 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt é obrigatório" });
    }

    const trackId = `mixfy_${uuidv4()}`;

    // 1️⃣ cria a track imediatamente (fila)
    await createTrack({
      id: trackId,
      status: "processing",
      prompt,
      style,
      duration,
      attempts: 0,
    });

    // 2️⃣ responde IMEDIATAMENTE ao frontend
    res.json({
      status: "processing",
      trackId,
      estimatedTime: 20,
    });

    // 3️⃣ geração REAL em background (MusicGen)
    generateMusicGen(prompt, duration)
      .then((audioUrl) => {
        if (!audioUrl) {
          throw new Error("MusicGen não retornou áudio");
        }

        updateTrack(trackId, {
          status: "completed",
          audioUrl,
        });
      })
      .catch((err) => {
        console.error("❌ Erro MusicGen:", err);

        updateTrack(trackId, {
          status: "error",
          error: err.message || "Erro ao gerar música",
        });
      });

  } catch (error) {
    console.error("❌ Erro no /generate:", error);

    if (!res.headersSent) {
      res.status(500).json({ error: "Erro interno ao gerar música" });
    }
  }
});

export default router;

