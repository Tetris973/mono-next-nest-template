'use server';
import { checkAuthentication } from '@web/common/helpers/check-authentication.helpers';
import { redirect } from 'next/navigation';

export async function ProtectedRoute() {
  const { error } = checkAuthentication();
  if (error) {
    redirect('/auth/login');
  }
}
