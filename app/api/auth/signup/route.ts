import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    const { data, error } = await supabase.auth.signUpWithPassword({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });

    if (error) throw error;

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user?.id,
          email: data.user?.email,
          display_name: name,
        },
      ]);

    if (profileError) throw profileError;

    return NextResponse.json(
      {
        success: true,
        user: data.user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
