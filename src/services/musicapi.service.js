import { createMusic, getMusicStatus } from "./mureka.service.js";

export async function generateFullMusic({ prompt, style, duration = 15 }) {
  // 1️⃣ Cria job na Mureka
  const response = await createMusic({
    prompt,
    style,
    duration,
  });

  if (!response || !response.trackId) {
    throw new Error("Falha ao criar música na Mureka");
  }

  return {
    murekaJobId: response.trackId,
    status: response.status || "processing",
    estimatedTime: response.estimatedTime || 20,
  };
}

export async function getFullMusicStatus(murekaJobId) {
  if (!murekaJobId) {
    throw new Error("murekaJobId não informado");
  }

  // 2️⃣ Consulta status da Mureka
  const result = await getMusicStatus(murekaJobId);

  if (!result) {
    throw new Error("Falha ao consultar status na Mureka");
  }

  return result;
}
