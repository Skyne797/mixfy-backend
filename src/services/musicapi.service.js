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

  return data.audioUrl;
}



