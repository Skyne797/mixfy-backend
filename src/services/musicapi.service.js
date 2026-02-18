import { createMusic, getMusicStatus } from "./mureka.service.js";

export async function generateFullMusic({ prompt, style, duration = 15 }) {
  const response = await createMusic({ prompt, style, duration });

  console.log("📌 RESPOSTA MUREKA createMusic:", response);

  const murekaJobId =
    response?.trackId ||
    response?.jobId ||
    response?.id ||
    response?.data?.trackId ||
    response?.data?.jobId ||
    response?.data?.id;

  if (!murekaJobId) {
    throw new Error("Falha ao criar música na Mureka: jobId não retornado");
  }

  return {
    murekaJobId,
    status: response.status || response?.data?.status || "processing",
    estimatedTime: response.estimatedTime || response?.data?.estimatedTime || 20,
  };
}

export async function getFullMusicStatus(murekaJobId) {
  if (!murekaJobId) {
    throw new Error("murekaJobId não informado");
  }

  const result = await getMusicStatus(murekaJobId);

  if (!result) {
    throw new Error("Falha ao consultar status na Mureka");
  }

  return result;
}

