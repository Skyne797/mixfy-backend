export async function generateMusic(trackId, data) {
  console.log("🎵 Gerando música:", trackId);

  // simulação de tempo de geração
  await new Promise((resolve) => setTimeout(resolve, 8000));

  return "https://link_do_audio.mp3";
}


