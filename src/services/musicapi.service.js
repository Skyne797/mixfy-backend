import { createMusic, getMusicStatus } from "./mureka.service.js";

export async function generateFullMusic({ prompt, style, duration = 15 }) {
  // 1️⃣ Cria música na Mureka
  const { trackId, status, estimatedTime } = await createMusic({
    prompt,
    style,
    duration,
  });

  return {
    trackId,
    status,
    estimatedTime,
  };
}

export async function getFullMusicStatus(trackId) {
  // 2️⃣ Consulta status da música
  const result = await getMusicStatus(trackId);

  return result;
}
