import { OpenAI } from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_TOKEN,
  baseURL: "https://openrouter.ai/api/v1/",
});

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const { prompt } = await req.json();

  const response = await openai.chat.completions.create({
    model: "nousresearch/hermes-3-llama-3.1-405b",
    messages: [
      {
        role: "system",
        content:
          "You are an AI writing assistant that generates a script based on the provided prompt. Make sure to use 'Narrator:' keyword when voice-over is used and include 'scene:' keywords to specify the video background scenes.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  });

  const script = response.choices[0]?.message?.content!.trim() || 'No script generated';

  return new Response(JSON.stringify({ script }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
