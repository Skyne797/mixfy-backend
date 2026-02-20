import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createTrack, updateTrack, getTrack } from "../storage/tracks.store.js";
import {
  generateFullMusic,
  getFullMusicStatus,
} from "../services/musicapi.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("➡️ POST /generate recebido");
  console.log("📦 BODY:", req.body);

  try {
    const { prompt, style, duration } = req.body;

    if (!prompt || !style) {
      console.log("❌ Prompt ou style ausente");
      return res.status(400).json({ error: "Prompt e style são obrigatórios" });
    }

    const trackId = `mixfy_${uuidv4()}`;

    // 1️⃣ cria track local
    createTrack(trackId, {
      status: "processing",
      prompt,
      style,
      duration,
      attempts: 0,
    });

    console.log("🆔 Track criada:", trackId);

    // 2️⃣ cria job na Mureka
    const result = await generateFullMusic({
      prompt,
      style,
      duration,
    });

    console.log("🎵 Resposta generateFullMusic:", result);

    const { murekaJobId, estimatedTime } = result;

    if (!murekaJobId) {
      throw new Error("Falha ao criar job na Mureka");
    }

    // 3️⃣ salva relação local ↔ mureka
    updateTrack(trackId, {
      murekaJobId,
    });

    console.log("🔗 MurekaJobId salvo:", murekaJobId);

    // 4️⃣ responde imediatamente
    res.json({
      status: "processing",
      trackId,
      estimatedTime: estimatedTime ?? 20,
    });

  } catch (e) {
    console.error("🔥 ERRO REAL NO /generate:", e);

    res.status(500).json({
      error: "Erro ao gerar música",
      detail: e.message,
    });
  }
});

router.get("/status/:id", async (req, res) => {
  console.log("➡️ GET /generate/status recebido:", req.params.id);

  const track = getTrack(req.params.id);
  if (!track) {
    console.log("❌ Track não encontrada");
    return res.status(404).json({ error: "Track not found" });
  }

  if (track.status === "completed" || track.status === "error") {
    return res.json(track);
  }

  try {
    const result = await getFullMusicStatus(track.murekaJobId);

    console.log("🔎 Status da Mureka:", result);

    if (!result || !result.status) {
      throw new Error("Resposta inválida da Mureka");
    }

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
    console.error("🔥 ERRO NO /status:", err);

    updateTrack(req.params.id, {
      status: "error",
      error: err.message,
    });

    res.json(getTrack(req.params.id));
  }
});

export default router;
