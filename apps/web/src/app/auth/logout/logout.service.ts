// app/auth/logout/logout.service.ts
'use server';

import { cookies } from 'next/headers';

export async function logoutAction() {
  const cookieStore = cookies();
  cookieStore.set('Authentication', '', { path: '/', expires: new Date(0) });
}
