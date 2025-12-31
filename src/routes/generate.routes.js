import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Inicializa Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * POST /generate
 */
router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;
    const trackId = `mixfy_${uuidv4()}`;

    // 1️⃣ Registra imediatamente a track no Supabase
    const { error: insertError } = await supabase
      .from("tracks")
      .insert([{ id: trackId, prompt, style, duration, status: "processing" }]);

    if (insertError) {
      console.error("Erro ao inserir track:", insertError);
      return res.status(500).json({ error: "Erro ao registrar música" });
    }

    // 2️⃣ Responde rápido para Lovable
    res.json({ status: "processing", trackId, estimatedTime: 10 });

    // 3️⃣ Processamento assíncrono
    setTimeout(async () => {
      const audioUrl = "https://mixfy.fake/audio-demo.mp3"; // Substitua pela URL real

      const { error: updateError } = await supabase
        .from("tracks")
        .update({ status: "completed", audio_url: audioUrl })
        .eq("id", trackId);

      if (updateError) console.error("Erro ao atualizar track:", updateError);
      else console.log(`Música ${trackId} concluída!`);
    }, 15000); // tempo de geração simulado
  } catch (error) {
    console.error("Erro no POST /generate:", error);
    res.status(500).json({ error: "Erro ao gerar música" });
  }
});

/**
 * GET /generate/:trackId
 */
router.get("/:trackId", async (req, res) => {
  try {
    const { trackId } = req.params;

    const { data: track, error } = await supabase
      .from("tracks")
      .select("*")
      .eq("id", trackId)
      .single();

    if (error || !track) return res.status(404).json({ error: "Track not found" });

    res.json(track);
  } catch (error) {
    console.error("Erro no GET /generate/:trackId:", error);
    res.status(500).json({ error: "Erro ao consultar música" });
  }
});

export default router;

