import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createTrack, updateTrack, getTrack } from "../storage/tracks.store.js";
import {
  generateFullMusic,
  getFullMusicStatus,
} from "../services/musicapi.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;
    const trackId = `mixfy_${uuidv4()}`;

    // 1️⃣ cria track local
    createTrack(trackId, {
      status: "processing",
      prompt,
      style,
      duration,
      attempts: 0,
    });

    // 2️⃣ cria job na Mureka
    const { murekaJobId, estimatedTime } = await generateFullMusic({
      prompt,
      style,
      duration,
    });

    if (!murekaJobId) {
      throw new Error("Falha ao criar job na Mureka");
    }

    // 3️⃣ salva relação local ↔ mureka
    updateTrack(trackId, {
      murekaJobId,
    });

    // 4️⃣ responde imediatamente
    res.json({
      status: "processing",
      trackId,
      estimatedTime: estimatedTime ?? 20,
    });
  } catch (e) {
    res.status(500).json({ error: "Erro ao gerar música" });
  }
});

router.get("/status/:id", async (req, res) => {
  const track = getTrack(req.params.id);
  if (!track) return res.status(404).json({ error: "Track not found" });

  // se já finalizou, devolve direto
  if (track.status === "completed" || track.status === "error") {
    return res.json(track);
  }

  try {
    // 5️⃣ consulta status na Mureka
    const result = await getFullMusicStatus(track.murekaJobId);

    if (!result || !result.status) {
      throw new Error("Resposta inválida da Mureka");
    }

    // 6️⃣ atualiza conforme status
    if (result.status === "completed") {
      updateTrack(req.params.id, {
        status: "completed",
        audioUrl: result.audioUrl,
      });
    } else if (result.status === "error") {
      updateTrack(req.params.id, {
        status: "error",
        error: result.error || "Erro na Mureka",
      });
    }

    res.json(getTrack(req.params.id));
  } catch (err) {
    updateTrack(req.params.id, {
      status: "error",
      error: err.message,
    });

    res.json(getTrack(req.params.id));
  }
});

export default router;
