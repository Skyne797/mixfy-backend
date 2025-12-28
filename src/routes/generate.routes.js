import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createTrack, updateTrack } from "../storage/tracks.store.js";

const router = express.Router();

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
    console.error("Erro no /generate:", error);
  }
});

export default router;


