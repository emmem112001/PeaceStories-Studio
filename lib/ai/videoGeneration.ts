import axios from 'axios';
import { VideoGenerationParams } from '../types';

const replicateClient = axios.create({
  baseURL: 'https://api.replicate.com/v1',
  headers: {
    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
  },
});

export async function generateVideoReplicate(params: VideoGenerationParams) {
  try {
    let version = '';
    let input: Record<string, any> = {};

    if (params.image_url) {
      // Image-to-video using Runway Gen-2
      version = 'f1af91f60c6d97d64610fda85aaa383467ef269747553fc49901781841ad2e45';
      input = {
        input_image: params.image_url,
        prompt: params.prompt || '',
        motion: params.camera_movement || 'none',
        duration: Math.min(params.duration, 60),
      };
    } else if (params.prompt) {
      // Text-to-video using Runway Gen-3
      version = 'a25d7484c4a0b3b0d50380c8cc14c7d78ad477d987e736bb0ed5a419d4633de';
      input = {
        prompt: params.prompt,
        duration: Math.min(params.duration, 30),
      };
    } else {
      throw new Error('Either prompt or image_url is required');
    }

    const response = await replicateClient.post('/predictions', {
      version,
      input,
      webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/replicate`,
      webhook_events_filter: ['completed', 'failed'],
    });

    return response.data;
  } catch (error: any) {
    console.error('Replicate Error:', error.response?.data || error.message);
    throw new Error(`Video generation failed: ${error.message}`);
  }
}

export async function pollVideoGeneration(predictionId: string) {
  try {
    const response = await replicateClient.get(`/predictions/${predictionId}`);
    return response.data;
  } catch (error: any) {
    console.error('Replicate Poll Error:', error.response?.data || error.message);
    throw new Error(`Failed to poll video generation: ${error.message}`);
  }
}
