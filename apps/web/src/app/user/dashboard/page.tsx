import { Dashboard } from './Dashboard';
import { ProtectedRoute } from '@web/app/auth/ProtectedRoute';

export default function DashboardPage(): JSX.Element {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
