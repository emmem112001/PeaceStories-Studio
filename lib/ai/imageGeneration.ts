import axios from 'axios';
import { ImageGenerationParams } from '../types';

const stabilityClient = axios.create({
  baseURL: 'https://api.stability.ai/v2beta/stable-image/generate',
  headers: {
    Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
  },
});

export async function generateImageStabilityAI(params: ImageGenerationParams) {
  try {
    const aspectRatios: Record<string, string> = {
      '1:1': '1:1',
      '3:4': '3:4',
      '4:3': '4:3',
      '9:16': '9:16',
      '16:9': '16:9',
      '21:9': '21:9',
    };

    const formData = new FormData();
    formData.append('prompt', params.prompt);
    if (params.negative_prompt) {
      formData.append('negative_prompt', params.negative_prompt);
    }
    formData.append('aspect_ratio', aspectRatios[params.aspect_ratio]);
    formData.append('output_format', 'png');

    const response = await stabilityClient.post('/core', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    });

    return response.data;
  } catch (error: any) {
    console.error('Stability AI Error:', error.response?.data || error.message);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

export async function imageToImageStabilityAI(
  imageBuffer: Buffer,
  prompt: string
) {
  try {
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image', blob);
    formData.append('prompt', prompt);
    formData.append('output_format', 'png');

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/img2img',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Stability AI I2I Error:', error.response?.data || error.message);
    throw new Error(`Image-to-image generation failed: ${error.message}`);
  }
}

export async function upscaleImageStabilityAI(imageBuffer: Buffer) {
  try {
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image', blob);
    formData.append('output_format', 'png');

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/ultra-upscale',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_AI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Stability AI Upscale Error:', error.response?.data || error.message);
    throw new Error(`Upscaling failed: ${error.message}`);
  }
}
