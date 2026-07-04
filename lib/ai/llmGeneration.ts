import axios from 'axios';
import { ScriptGenerationParams } from '../types';

const openrouterClient = axios.create({
  baseURL: 'https://openrouter.io/api/v1',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL,
    'X-Title': 'PeaceStories Studio',
  },
});

export async function generateScript(
  params: ScriptGenerationParams
): Promise<string> {
  try {
    const systemPrompt = `You are a professional screenwriter. Generate a ${params.style} script based on the user's request. The script should be ${params.length} in length. Format it as a proper screenplay with scene headings, action, character names, dialogue, and parentheticals.`;

    const response = await openrouterClient.post('/chat/completions', {
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: params.prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: params.length === 'short' ? 500 : params.length === 'medium' ? 1500 : 3000,
    });

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenRouter Error:', error.response?.data || error.message);
    throw new Error(`Script generation failed: ${error.message}`);
  }
}

export async function generateStory(
  prompt: string,
  length: 'short' | 'medium' | 'long' = 'medium'
): Promise<string> {
  try {
    const systemPrompt = 'You are a creative storyteller. Generate a compelling story based on the user\'s prompt. Make it engaging and vivid.';

    const response = await openrouterClient.post('/chat/completions', {
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: length === 'short' ? 800 : length === 'medium' ? 2000 : 4000,
    });

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenRouter Story Error:', error.response?.data || error.message);
    throw new Error(`Story generation failed: ${error.message}`);
  }
}

export async function generateCharacter(
  prompt: string
): Promise<{ description: string; characteristics: string[] }> {
  try {
    const systemPrompt = `You are a character development expert. Generate a detailed character profile based on the user's description. Respond in JSON format with 'description' (detailed character profile) and 'characteristics' (array of key traits).`;

    const response = await openrouterClient.post('/chat/completions', {
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error: any) {
    console.error('OpenRouter Character Error:', error.response?.data || error.message);
    throw new Error(`Character generation failed: ${error.message}`);
  }
}
