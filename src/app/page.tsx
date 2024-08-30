"use client";
import Image from 'next/image';
import React, { useState } from 'react';

const HomePage = () => {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrls, setVideoUrls] = useState<string[] | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generatingScript' | 'generatingAudio' | 'fetchingVideos' | 'completed' | 'error'>('idle');

  const handleGenerate = async () => {
    try {
      setStatus('generatingScript');
      
      // Step 1: Generate the script
      const scriptResponse = await fetch('/api/generateScript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!scriptResponse.ok) {
        throw new Error('Failed to generate script');
      }

      const { script } = await scriptResponse.json();
      setGeneratedScript(script);

      setStatus('generatingAudio');
    
      // Step 2: Generate audio based on the script
      const audioResponse = await fetch('/api/generateAudio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      });

      if (!audioResponse.ok) {
        throw new Error('Failed to generate audio');
      }

      const { audioUrl } = await audioResponse.json();
      setAudioUrl(audioUrl);

      setStatus('fetchingVideos');
      
      // Step 3: Fetch video URLs based on the script
      const scenes = extractScenes(script); // Extract scenes from the script
      console.log(scenes);
      
      // Use the Pexels API route to fetch videos
      const videoResponse = await fetch('/api/fetchVideos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompts: scenes }),
      });

      if (!videoResponse.ok) {
        throw new Error('Failed to fetch videos');
      }

      const { videos } = await videoResponse.json();
      const videoUrls = videos.map((video: any) => video.video_files?.[0]?.link).filter(Boolean);
      setVideoUrls(videoUrls);

      setStatus('completed');
      
    } catch (error) {
      console.error('Error generating content:', error);
      setStatus('error');
    }
  };

  const extractScenes = (script: string): string[] => {
    const sceneRegex = /Scene:\s*([^\n]+)/gi;
    const scenes = new Set<string>();
    let match;
  
    while ((match = sceneRegex.exec(script)) !== null) {
      scenes.add(match[1].trim());
    }
  
    return Array.from(scenes);
  };  

  return (
    <div className="flex-col min-h-screen bg-gray-200 flex items-center justify-center p-4">
    
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg border border-gray-300">
        {/* <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Prompt2Shorts</h1> */}
        <Image src={"/logo.png"} alt='logo' width={500} height={100} className='mb-6 rounded-lg'/>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={4}
        />
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Generate
        </button>
        
        {status === 'generatingScript' && (
          <p className="mt-4 text-yellow-600">Generating script...</p>
        )}
        {status === 'generatingAudio' && (
          <p className="mt-4 text-yellow-600">Generating audio...</p>
        )}
        {status === 'fetchingVideos' && (
          <p className="mt-4 text-yellow-600">Fetching videos...</p>
        )}
          <>
            {generatedScript && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generated Script</h2>
                <p className="bg-gray-100 p-4 border border-gray-300 rounded-md">{generatedScript}</p>
              </div>
            )}
            {audioUrl && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generated Audio</h2>
                <audio controls src={audioUrl} className="w-full rounded-md shadow-sm" />
              </div>
            )}
            {videoUrls && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generated Videos</h2>
                {videoUrls.map((url, index) => (
                  <video key={index} controls src={url} className="w-full rounded-md shadow-sm mb-4" />
                ))}
              </div>
            )}
          </>

        {status === 'error' && (
          <p className="mt-4 text-red-600">An error occurred while generating content.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
