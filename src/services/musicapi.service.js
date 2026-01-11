

/**
 * Gera música com voz usando Music API
 */
export async function generateMusicWithVoice({
  prompt,
  duration = 15,
  style = "pop",
}) {
  const response = await fetch("https://api.musicapi.ai/v1/music", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MUSIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      duration,
      style,
      vocal: true,
      quality: "high",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MusicAPI error: ${error}`);
  }

  const data = await response.json();
  console.log("🎵 RESPOSTA MUSIC API:", data);

  // 🔹 Caso 1: veio direto
  if (data.audioUrl) return data.audioUrl;
  if (data.url) return data.url;
  if (data.audio?.url) return data.audio.url;
  if (data.result?.audioUrl) return data.result.audioUrl;

  // 🔹 Caso 2: veio como processamento
  if (data.status === "processing" && data.id) {
    return await waitForMusic(data.id);
  }

  throw new Error(
    "Formato de resposta desconhecido: " + JSON.stringify(data)
  );
}

/**
 * Polling até a música ficar pronta
 */
async function waitForMusic(id) {
  const maxTries = 20;
  let tries = 0;

  while (tries < maxTries) {
    await sleep(3000);

    const res = await fetch(`https://api.musicapi.ai/v1/music/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.MUSIC_API_KEY}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Status error: ${error}`);
    }

    const data = await res.json();
    console.log("⏳ STATUS MUSIC API:", data);

    if (data.audioUrl) return data.audioUrl;
    if (data.url) return data.url;
    if (data.audio?.url) return data.audio.url;
    if (data.result?.audioUrl) return data.result.audioUrl;

    if (data.status === "error") {
      throw new Error("Erro na geração da música");
    }

    tries++;
  }

  throw new Error("Tempo limite esperando música ficar pronta");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}




