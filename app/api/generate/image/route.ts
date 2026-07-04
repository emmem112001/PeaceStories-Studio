import { NextRequest, NextResponse } from 'next/server';
import { generateImageStabilityAI, imageToImageStabilityAI, upscaleImageStabilityAI } from '@/lib/ai/imageGeneration';
import { uploadToSupabaseStorage, getPublicURL } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { action, prompt, negativePrompt, aspectRatio, quality, style, imageUrl, projectId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let imageBuffer: Buffer;
    let filename: string;

    switch (action) {
      case 'generate':
        imageBuffer = await generateImageStabilityAI({
          prompt,
          negative_prompt: negativePrompt,
          aspect_ratio: aspectRatio || '16:9',
          quality: quality || 'standard',
          style,
        });
        filename = `image-${Date.now()}.png`;
        break;

      case 'image-to-image':
        if (!imageUrl) throw new Error('Image URL required for image-to-image');
        const imageResponse = await fetch(imageUrl);
        const imageData = await imageResponse.arrayBuffer();
        imageBuffer = await imageToImageStabilityAI(Buffer.from(imageData), prompt);
        filename = `i2i-${Date.now()}.png`;
        break;

      case 'upscale':
        if (!imageUrl) throw new Error('Image URL required for upscaling');
        const upscaleResponse = await fetch(imageUrl);
        const upscaleData = await upscaleResponse.arrayBuffer();
        imageBuffer = await upscaleImageStabilityAI(Buffer.from(upscaleData));
        filename = `upscaled-${Date.now()}.png`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Upload to Supabase
    const storagePath = `${userId}/images/${filename}`;
    await uploadToSupabaseStorage('peacestories-assets', storagePath, imageBuffer, 'image/png');
    const publicUrl = await getPublicURL('peacestories-assets', storagePath);

    // Save to database
    const { data: asset, error: dbError } = await supabase
      .from('generated_assets')
      .insert([
        {
          project_id: projectId,
          user_id: userId,
          type: 'image',
          url: publicUrl,
          metadata: { action, aspectRatio, quality, style },
          prompt,
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
        prompt,
      },
    });
  } catch (error: any) {
    console.error('Image generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Image generation failed' },
      { status: 500 }
    );
  }
}
