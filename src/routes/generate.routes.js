import express from "express";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

/**
 * POST /generate
 * Cria uma nova música
 */
router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;

    const trackId = `mixfy_${uuidv4()}`;

    // salva imediatamente no banco como "processing"
    const { error: insertError } = await supabase
      .from("tracks")
      .insert([
        {
          id: trackId,
          prompt,
          style,
          duration,
          status: "processing",
        },
      ]);

    if (insertError) {
      console.error(insertError);
      return res.status(500).json({ error: "Erro ao salvar música" });
    }

    // responde ao frontend
    res.json({
      status: "processing",
      trackId,
      estimatedTime: 10,
    });

    // simula geração da música
    setTimeout(async () => {
      await supabase
        .from("tracks")
        .update({
          status: "completed",
          audio_url: "https://mixfy.fake/audio-demo.mp3",
        })
        .eq("id", trackId);
    }, 8000);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

/**
 * GET /generate/:trackId
 * Consulta status da música
 */
router.get("/:trackId", async (req, res) => {
  const { trackId } = req.params;

  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("id", trackId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Track not found" });
  }

  res.json(data);
});

/**
 * GET /generate
 * Galeria de músicas
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Erro ao carregar galeria" });
  }

  res.json(data);
});

export default router;

 