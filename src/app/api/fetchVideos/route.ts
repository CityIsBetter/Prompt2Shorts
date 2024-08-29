import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompts } = await req.json();
  
  if (!prompts || !Array.isArray(prompts)) {
    return NextResponse.json({ error: 'Invalid prompts array' }, { status: 400 });
  }

  const API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  const PEXELS_API_URL = 'https://api.pexels.com/videos/search';

  const fetchVideo = async (prompt: string) => {
    const response = await fetch(`${PEXELS_API_URL}?query=${encodeURIComponent(prompt)}&per_page=1`, {
      headers: {
        Authorization: API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video for prompt: ${prompt}`);
    }

    const data = await response.json();
    return data.videos?.[0] || null;  // Return the first video or null if none found
  };

  try {
    const videoPromises = prompts.map((prompt: string) => fetchVideo(prompt));
    const videos = await Promise.all(videoPromises);

    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
