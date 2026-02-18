const MUREKA_API_URL = "https://api.mureka.ai/v1";

export async function createMusic({ prompt, style, duration = 15 }) {
  const res = await fetch(`${MUREKA_API_URL}/music`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MUREKA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      style,
      duration,
      format: "mp3",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Mureka error: " + err);
  }

  const data = await res.json();

  return {
    trackId: data.id,
    status: data.status ?? "processing",
    estimatedTime: data.estimated_time ?? 20,
  };
}
