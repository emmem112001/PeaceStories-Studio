import axios from 'axios';
import { MusicGenerationParams } from '../types';

const sunoClient = axios.create({
  baseURL: 'https://api.suno.ai',
  headers: {
    'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
  },
});

export async function generateMusicSuno(
  params: MusicGenerationParams
): Promise<{ music_url: string; id: string }> {
  try {
    const response = await sunoClient.post('/api/generate', {
      prompt: params.prompt,
      make_instrumental: false,
      duration: Math.min(params.duration, 180),
      style: `${params.genre} ${params.mood}`,
      tags: [params.genre, params.mood],
    });

    return {
      music_url: response.data.audio_url,
      id: response.data.id,
    };
  } catch (error: any) {
    console.error('Suno AI Error:', error.response?.data || error.message);
    throw new Error(`Music generation failed: ${error.message}`);
  }
}

export async function pollMusicGeneration(musicId: string) {
  try {
    const response = await sunoClient.get(`/api/generate/${musicId}`);
    return response.data;
  } catch (error: any) {
    console.error('Suno Poll Error:', error.response?.data || error.message);
    throw new Error(`Failed to poll music generation: ${error.message}`);
  }
}
