import axios from 'axios';
import { AudioGenerationParams } from '../types';

const elevenlabsClient = axios.create({
  baseURL: 'https://api.elevenlabs.io/v1',
  headers: {
    'xi-api-key': process.env.ELEVENLABS_API_KEY,
  },
});

export async function generateAudioElevenLabs(
  params: AudioGenerationParams
): Promise<Buffer> {
  try {
    const response = await elevenlabsClient.post(
      `/text-to-speech/${params.voice_id}`,
      {
        text: params.text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        responseType: 'arraybuffer',
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ElevenLabs Error:', error.response?.data || error.message);
    throw new Error(`Text-to-speech generation failed: ${error.message}`);
  }
}

export async function getVoicesList() {
  try {
    const response = await elevenlabsClient.get('/voices');
    return response.data.voices;
  } catch (error: any) {
    console.error('ElevenLabs Voices Error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch voices: ${error.message}`);
  }
}
