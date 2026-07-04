import { NextRequest, NextResponse } from 'next/server';
import { generateMusicSuno, pollMusicGeneration } from '@/lib/ai/musicGeneration';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { action, prompt, genre, mood, duration, projectId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'generate') {
      const result = await generateMusicSuno({
        prompt,
        genre,
        mood,
        duration: duration || 60,
      });

      // Save job to database
      const { data: job, error: dbError } = await supabase
        .from('generation_jobs')
        .insert([
          {
            user_id: userId,
            project_id: projectId,
            type: 'music',
            prompt,
            status: 'processing',
            metadata: { suno_id: result.id, genre, mood },
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      return NextResponse.json({
        success: true,
        job_id: job.id,
        suno_id: result.id,
        status: 'processing',
      });
    }

    if (action === 'poll') {
      const { sunoId } = await request.json();
      const result = await pollMusicGeneration(sunoId);

      if (result.status === 'complete') {
        // Update job status
        const { error: updateError } = await supabase
          .from('generation_jobs')
          .update({
            status: 'completed',
            result_url: result.music_url,
            completed_at: new Date().toISOString(),
          })
          .eq('metadata->suno_id', sunoId);

        if (updateError) throw updateError;
      }

      return NextResponse.json({
        status: result.status,
        music_url: result.music_url,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Music generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Music generation failed' },
      { status: 500 }
    );
  }
}
