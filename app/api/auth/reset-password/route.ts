import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { password, token } = await request.json();

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (error: any) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: error.message || 'Password update failed' },
      { status: 500 }
    );
  }
}
