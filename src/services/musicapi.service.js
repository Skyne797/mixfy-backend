import fs from "fs";
import path from "path";
import { generateVoice } from "./voice.service.js";

export async function generateFullMusic({ prompt, style, duration }) {
  const voiceBuffer = await generateVoice({ text: prompt });

  const fileName = `mixfy_${Date.now()}.mp3`;
  const filePath = path.join("public", "audios", fileName);

  fs.mkdirSync("public/audios", { recursive: true });
  fs.writeFileSync(filePath, voiceBuffer);

  return `https://SEU_BACKEND/public/audios/${fileName}`;
}


