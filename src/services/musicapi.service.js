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

