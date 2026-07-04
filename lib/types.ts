export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  status: 'draft' | 'generating' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
}

export interface GeneratedAsset {
  id: string;
  project_id: string;
  user_id: string;
  type: 'image' | 'video' | 'audio' | 'script' | 'subtitle';
  url: string;
  metadata: Record<string, any>;
  prompt: string;
  created_at: string;
}

export interface GenerationJob {
  id: string;
  user_id: string;
  project_id: string;
  type: 'image' | 'video' | 'audio' | 'music' | 'script' | 'character' | 'subtitle';
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result_url?: string;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface ImageGenerationParams {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
  quality: 'standard' | 'high';
  style?: string;
  num_outputs?: number;
}

export interface VideoGenerationParams {
  prompt?: string;
  image_url?: string;
  duration: number;
  resolution: '720p' | '1080p' | '2k' | '4k';
  fps: 24 | 30 | 60;
  camera_movement?: 'pan' | 'zoom' | 'dolly' | 'none';
}

export interface AudioGenerationParams {
  text: string;
  voice_id: string;
  language?: string;
}

export interface MusicGenerationParams {
  prompt: string;
  genre: string;
  mood: string;
  duration: number;
}

export interface ScriptGenerationParams {
  prompt: string;
  style: 'documentary' | 'narrative' | 'comedy' | 'educational';
  length: 'short' | 'medium' | 'long';
}
