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
 * Cria uma nova música
 */
router.post("/", async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;

    // Gera ID único da música
    const trackId = `mixfy_${uuidv4()}`;

    // 1️⃣ Registra imediatamente a track no Supabase com status "processing"
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
      console.error("Erro ao inserir track no Supabase:", insertError);
      return res.status(500).json({ error: "Erro ao registrar música" });
    }

    // 2️⃣ Retorna imediatamente para o frontend / Lovable
    res.json({
      status: "processing",
      trackId,
      estimatedTime: 10, // segundos
    });

    // 3️⃣ Simula geração da música (pipeline)
    setTimeout(async () => {
      // Atualiza track quando a música estiver pronta
      const { error: updateError } = await supabase
        .from("tracks")
        .update({
          status: "completed",
          audio_url: "https://mixfy.fake/audio-demo.mp3", // aqui você coloca a URL real quando gerar
        })
        .eq("id", trackId);

      if (updateError) {
        console.error("Erro ao atualizar track no Supabase:", updateError);
      } else {
        console.log(`Música ${trackId} atualizada com sucesso!`);
      }
    }, 8000); // tempo de geração simulado

  } catch (error) {
    console.error("Erro no POST /generate:", error);
    res.status(500).json({ error: "Erro ao gerar música" });
  }
});

/**
 * GET /generate/:trackId
 * Consulta o status da música
 */
router.get("/:trackId", async (req, res) => {
  try {
    const { trackId } = req.params;

    const { data: track, error } = await supabase
      .from("tracks")
      .select("*")
      .eq("id", trackId)
      .single();

    if (error || !track) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.json(track);
  } catch (error) {
    console.error("Erro no GET /generate/:trackId:", error);
    res.status(500).json({ error: "Erro ao consultar música" });
  }
});

export default router;