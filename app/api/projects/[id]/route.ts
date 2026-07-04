import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    // Fetch project assets
    const { data: assets, error: assetsError } = await supabase
      .from('generated_assets')
      .select('*')
      .eq('project_id', params.id);

    if (assetsError) throw assetsError;

    return NextResponse.json({
      project,
      assets,
    });
  } catch (error: any) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const body = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(body)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Project update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Project delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
