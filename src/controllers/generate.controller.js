import crypto from "crypto";
import { generateMusicService } from "../services/generate.service.js";

export async function generateMusic(req, res) {
  try {
    const { prompt, style = "auto", duration = 15 } = req.body;

    // 🔒 Validação básica
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Prompt é obrigatório e deve ser texto",
      });
    }

    // ⏱️ Limite de duração (5s a 60s)
    const finalDuration = Math.min(Math.max(duration, 5), 60);

    // 🎼 Prompt único (padrão Mixfy)
    const enrichedPrompt = `
${prompt},
estilo musical ${style},
duração ${finalDuration} segundos,
início forte e imediato,
ritmo envolvente,
ideal para Reels, TikTok e Shorts
`.trim();

    // 🆔 ID único da música
    const trackId = `mixfy_${crypto.randomUUID()}`;

    // 🧠 Log de pipeline
    console.log("🎵 Mixfy pipeline iniciado:", {
      trackId,
      enrichedPrompt,
    });

    // 🔗 Chamada do service (IA futuramente)
    await generateMusicService(enrichedPrompt, finalDuration);

    // 📤 Resposta padrão para o frontend
    return res.status(200).json({
      status: "processing",
      trackId,
      estimatedTime: 10,
    });

  } catch (error) {
    console.error("❌ Erro no generate.controller:", error);
    return res.status(500).json({
      status: "error",
      message: "Erro interno no servidor",
    });
  }
}
