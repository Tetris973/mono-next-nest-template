import { Dashboard } from './Dashboard';
import { ProtectedRoute } from '@web/app/auth/protected-route.service';
import { Header } from '@web/app/components/Header';

export default async function DashboardPage(): Promise<JSX.Element> {
  await ProtectedRoute();
  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
}
