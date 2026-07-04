import { NextRequest, NextResponse } from 'next/server';
import { generateVideoReplicate, pollVideoGeneration } from '@/lib/ai/videoGeneration';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { action, prompt, imageUrl, duration, resolution, fps, cameraMovement, projectId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'generate') {
      const prediction = await generateVideoReplicate({
        prompt,
        image_url: imageUrl,
        duration: duration || 10,
        resolution: resolution || '1080p',
        fps: fps || 24,
        camera_movement: cameraMovement,
      });

      // Save job to database
      const { data: job, error: dbError } = await supabase
        .from('generation_jobs')
        .insert([
          {
            user_id: userId,
            project_id: projectId,
            type: 'video',
            prompt: prompt || 'Image to video',
            status: 'processing',
            metadata: { replicate_id: prediction.id, duration, resolution, fps },
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      return NextResponse.json({
        success: true,
        job_id: job.id,
        prediction_id: prediction.id,
        status: 'processing',
      });
    }

    if (action === 'poll') {
      const { predictionId } = await request.json();
      const prediction = await pollVideoGeneration(predictionId);

      if (prediction.status === 'succeeded') {
        // Update job status
        const { error: updateError } = await supabase
          .from('generation_jobs')
          .update({
            status: 'completed',
            result_url: prediction.output[0],
            completed_at: new Date().toISOString(),
          })
          .eq('metadata->replicate_id', predictionId);

        if (updateError) throw updateError;
      }

      return NextResponse.json({
        status: prediction.status,
        output: prediction.output,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Video generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Video generation failed' },
      { status: 500 }
    );
  }
}
