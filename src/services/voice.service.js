export async function generateVoice({ text }) {
  const VOICE_ID = "bIHbv24MWmeRgasZH58o"; // 🔥 voice_id REAL como string

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error("ElevenLabs error: " + err);
  }

  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer);
}


 