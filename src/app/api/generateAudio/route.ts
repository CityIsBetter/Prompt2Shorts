import { NextResponse } from 'next/server';
import https from 'https';

export async function POST(req: Request): Promise<Response> {
  try {
    const { script } = await req.json();

    // Simplified regex patterns
    const narratorPattern = /Narrator:\s*([^]*?)(?=\n\n|$)/g;
    const narratorVO_Pattern = /Narrator \(V\.O\.\):\s*([^]*?)(?=\n\n|$)/g;

    // Attempt to match both patterns
    const narratorMatches = script.match(narratorPattern) || script.match(narratorVO_Pattern);

    // Combine matches into one script string, if any are found
    let narratorScript = narratorMatches
      ?.map((line: string) => line.replace(/Narrator:\s*|Narrator \(V\.O\.\):\s*/, '').trim())
      .join(' ');

    if (!narratorScript) {
      console.error('Narrator script not found or empty:', script);
      return new NextResponse('No narrator script found', { status: 400 });
    }

    // Normalize the script by removing extra spaces and line breaks
    narratorScript = narratorScript.replace(/\s+/g, ' ').trim();
    
    const options = {
      method: 'GET',
      hostname: 'express-voic-text-to-speech.p.rapidapi.com',
      port: null,
      path: `/getAudioLink?service=StreamElements&voice=Joanna&text=${encodeURIComponent(narratorScript)}`,
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        'x-rapidapi-host': 'express-voic-text-to-speech.p.rapidapi.com',
      },
    };

    const audioUrl = await new Promise<string>((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          const jsonResponse = JSON.parse(body);

          if (jsonResponse.status === 'success' && jsonResponse.audio_url) {
            resolve(jsonResponse.audio_url);
          } else {
            reject(new Error('Audio URL not found in the response'));
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.end();
    });

    return new NextResponse(JSON.stringify({ audioUrl }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating audio:', error);
    return new NextResponse('Error generating audio', { status: 500 });
  }
}
