// app/dashboard/dashboard.service.ts

'use server';

import { API_URL } from '@web/app/constants/api';
import { cookies } from 'next/headers';
import { User } from '@web/app/user/user.interface';

export const getAllUsersAction = async (): Promise<User[]> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  const res = await fetch(`${API_URL}/users`, {
    method: 'GET',
    headers: {
      Cookie: `Authentication=${token}`,
    },
  });

  if (res.ok) {
    return res.json();
  }

  // TODO: replace error by json message
  throw new Error(`Failed to fetch users. Status: ${res.status}`);
};

export const getUserByIdAction = async (id: string): Promise<User> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'GET',
    headers: {
      Cookie: `Authentication=${token}`,
    },
  });

  if (res.ok) {
    return res.json();
  }

  // TODO: replace error by json message
  throw new Error(`Failed to fetch user. Status: ${res.status}`);
};

export const deleteUserAction = async (id: string): Promise<void> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Cookie: `Authentication=${token}`,
    },
  });

  if (!res.ok) {
    // TODO: replace error by json message
    throw new Error(`Failed to delete user. Status: ${res.status}`);
  }
};

export const updateUserAction = async (user: User): Promise<User> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  const res = await fetch(`${API_URL}/users/${user.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `Authentication=${token}`,
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error(`Failed to update user. Status: ${res.status}`);
  }

  return res.json();
};
