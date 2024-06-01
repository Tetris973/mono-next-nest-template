// src/app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('Authentication')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decodedToken: { id: string; username: string } = jwtDecode(token);
    return NextResponse.json({ id: decodedToken.id, username: decodedToken.username });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
