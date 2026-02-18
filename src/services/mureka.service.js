export async function getMusicStatus(trackId) {
  const res = await fetch(`${MUREKA_API_URL}/music/${trackId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MUREKA_API_KEY}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Mureka status error: " + err);
  }

  const data = await res.json();

  return {
    status: data.status,
    audioUrl: data.audio_url,
  };
}
