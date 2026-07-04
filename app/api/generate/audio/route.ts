import { NextRequest, NextResponse } from 'next/server';
import { generateAudioElevenLabs, getVoicesList } from '@/lib/ai/audioGeneration';
import { uploadToSupabaseStorage, getPublicURL } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const voices = await getVoicesList();
    return NextResponse.json({ voices });
  } catch (error: any) {
    console.error('Fetch voices error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, projectId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const audioBuffer = await generateAudioElevenLabs({
      text,
      voice_id: voiceId,
      language: 'en',
    });

    // Upload to Supabase
    const filename = `audio-${Date.now()}.mp3`;
    const storagePath = `${userId}/audio/${filename}`;
    await uploadToSupabaseStorage('peacestories-assets', storagePath, audioBuffer, 'audio/mpeg');
    const publicUrl = await getPublicURL('peacestories-assets', storagePath);

    // Save to database
    const { data: asset, error: dbError } = await supabase
      .from('generated_assets')
      .insert([
        {
          project_id: projectId,
          user_id: userId,
          type: 'audio',
          url: publicUrl,
          metadata: { voiceId, duration: Math.ceil(text.length / 150) },
          prompt: text,
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.id,
        url: publicUrl,
      },
    });
  } catch (error: any) {
    console.error('Audio generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Audio generation failed' },
      { status: 500 }
    );
  }
}
