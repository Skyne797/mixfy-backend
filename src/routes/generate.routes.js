import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createTrack, updateTrack, getTrack } from "../storage/tracks.store.js";
import { generateMusicWithVoice } from "../services/musicapi.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt, style, duration } = req.body;
  const trackId = `mixfy_${uuidv4()}`;

  createTrack({
    id: trackId,
    status: "processing",
    prompt,
    style,
    duration,
  });

  res.json({
    status: "processing",
    trackId,
    estimatedTime: 20,
  });

  try {
    const audioUrl = await generateMusicWithVoice({ prompt, style, duration });

    console.log("🎵 Música gerada:", audioUrl);

    updateTrack(trackId, {
      status: "completed",
      audioUrl,
    });
  } catch (err) {
    console.error("❌ Erro ao gerar música:", err);

    updateTrack(trackId, {
      status: "error",
      error: err.message,
    });
  }
});

router.get("/status/:id", (req, res) => {
  const track = getTrack(req.params.id);

  if (!track) {
    return res.status(404).json({ error: "Track not found" });
  }

  res.json(track);
});

export default router;
