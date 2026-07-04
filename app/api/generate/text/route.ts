import { NextRequest, NextResponse } from 'next/server';
import { generateScript, generateStory, generateCharacter } from '@/lib/ai/llmGeneration';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { action, prompt, style, length, projectId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let content: any;
    let type: 'script' | 'story' | 'character' = 'script';

    switch (action) {
      case 'script':
        content = await generateScript({
          prompt,
          style: style || 'documentary',
          length: length || 'medium',
        });
        type = 'script';
        break;

      case 'story':
        content = await generateStory(prompt, length || 'medium');
        type = 'story';
        break;

      case 'character':
        content = await generateCharacter(prompt);
        type = 'character';
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Save to database
    const { data: asset, error: dbError } = await supabase
      .from('generated_assets')
      .insert([
        {
          project_id: projectId,
          user_id: userId,
          type,
          url: '', // Text content stored as string
          metadata: { content, style, length },
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
        type,
        content,
      },
    });
  } catch (error: any) {
    console.error('LLM generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
