import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateMusicGen(prompt, duration = 15) {
  const output = await replicate.run(
    "facebook/musicgen-small",
    {
      input: {
        prompt,
        duration,
      },
    }
  );

  // MusicGen retorna array de URLs
  return output[0];
}
