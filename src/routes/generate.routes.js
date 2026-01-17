import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createTrack, updateTrack, getTrack } from "../storage/tracks.store.js";
import { generateFullMusic } from "../services/musicapi.service.js";


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;
    const trackId = `mixfy_${uuidv4()}`;

    createTrack(trackId, {
      status: "processing",
      prompt,
      style,
      duration,
      attempts: 0,
    });

    res.json({ status: "processing", trackId, estimatedTime: 20 });

    generateFullMusic({ prompt, style, duration })
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
  } catch (e) {
    res.status(500).json({ error: "Erro ao gerar música" });
  }
});

router.get("/status/:id", (req, res) => {
  const track = getTrack(req.params.id);
  if (!track) return res.status(404).json({ error: "Track not found" });
  res.json(track);
});

export default router;
