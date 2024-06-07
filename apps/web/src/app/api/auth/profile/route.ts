// src/app/api/auth/profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { HttpStatus } from '@web/app/constants/http-status';
import { API_URL } from '@web/app/constants/api';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('Authentication')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: HttpStatus.UNAUTHORIZED });
  }

  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Cookie: `Authentication=${token}`,
      },
    });

    if (response.ok) {
      const profile = await response.json();
      return NextResponse.json(profile);
    }
    throw new Error('Failed to fetch profile');
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: HttpStatus.UNAUTHORIZED });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('Authentication')?.value;
  const { username, id } = await req.json();
  // const id = req.nextUrl.searchParams.get('id'); // To Get id from URL, we need to have param routing in nextjs

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: HttpStatus.UNAUTHORIZED });
  }

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: HttpStatus.BAD_REQUEST });
  }

  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: {
        Cookie: `Authentication=${token}`, // Use cookie for authentication
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const updatedProfile = await response.json();
      return NextResponse.json(updatedProfile);
    }
    console.log(response);
    throw new Error('Failed to update profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: HttpStatus.UNAUTHORIZED });
  }
}
