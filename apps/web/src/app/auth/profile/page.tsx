import { Header } from '@web/app/components/Header';
import { ProtectedRoute } from '@web/app/auth/protected-route.service';
import { ProfilePageClient } from './client-page';

export default async function ProfilePage() {
  await ProtectedRoute();

  return (
    <>
      <Header />
      <ProfilePageClient />
    </>
  );
}
