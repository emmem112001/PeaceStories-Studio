import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: userId,
          title,
          description,
          status: 'draft',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      projects,
    });
  } catch (error: any) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
