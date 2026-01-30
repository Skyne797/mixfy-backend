import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateVoice } from "./voice.service.js";

// necessário para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateFullMusic({ prompt, style, duration }) {
  // 1️⃣ Gera o áudio (ElevenLabs)
  const voiceBuffer = await generateVoice({ text: prompt });

  // 2️⃣ Cria nome do arquivo
  const fileName = `mixfy_${Date.now()}.mp3`;
  const audioDir = path.join(__dirname, "..", "..", "public", "audios");
  const filePath = path.join(audioDir, fileName);

  // 3️⃣ Garante a pasta
  fs.mkdirSync(audioDir, { recursive: true });

  // 4️⃣ Salva o arquivo
  fs.writeFileSync(filePath, voiceBuffer);

  // 5️⃣ URL FINAL REAL (Render)
  const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";

  return `${baseUrl}/public/audios/${fileName}`;
}



