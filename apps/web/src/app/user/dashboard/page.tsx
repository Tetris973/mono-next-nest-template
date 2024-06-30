import { Dashboard } from './Dashboard';
import { ProtectedRoute } from '@web/app/auth/ProtectedRoute';
import { Header } from '@web/app/components/Header';

export default function DashboardPage(): JSX.Element {
  return (
    <ProtectedRoute>
      <Header />
      <Dashboard />
    </ProtectedRoute>
  );
}
