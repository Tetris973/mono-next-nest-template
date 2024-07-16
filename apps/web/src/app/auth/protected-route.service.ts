'use server';
import { checkAuthentication } from '@web/app/utils/check-authentication.utils';
import { redirect } from 'next/navigation';

export async function ProtectedRoute() {
  const { error } = checkAuthentication();
  if (error) {
    redirect('/auth/login');
  }
}
