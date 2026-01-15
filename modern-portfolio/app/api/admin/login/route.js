import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await request.json().catch(() => ({}));
    return NextResponse.json(
      {
        error: 'Password login disabled. Use Google sign-in.'
      },
      { status: 410 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}