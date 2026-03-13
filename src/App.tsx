import { Routes, Route } from 'react-router';
import Layout from './components/layout';
import ProtectedRoute from './components/protected-route';
import CapabilityRoute from './components/capability-route';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import StoresListPage from './pages/stores/index';
import StoresNewPage from './pages/stores/new';
import StoresEditPage from './pages/stores/edit';
import UsersListPage from './pages/users/index';
import UsersNewPage from './pages/users/new';
import UsersEditPage from './pages/users/edit';
import RolesListPage from './pages/roles/index';
import RolesNewPage from './pages/roles/new';
import RolesDetailPage from './pages/roles/detail';
import ProfilePage from './pages/profile';

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route element={<CapabilityRoute check={(c) => c.stores.read} />}>
            <Route path="stores" element={<StoresListPage />} />
            <Route path="stores/:id/edit" element={<StoresEditPage />} />
          </Route>
          <Route element={<CapabilityRoute check={(c) => c.stores.create} />}>
            <Route path="stores/new" element={<StoresNewPage />} />
          </Route>
          <Route element={<CapabilityRoute check={(c) => c.users.read} />}>
            <Route path="users" element={<UsersListPage />} />
            <Route path="users/:id/edit" element={<UsersEditPage />} />
          </Route>
          <Route element={<CapabilityRoute check={(c) => c.users.create} />}>
            <Route path="users/new" element={<UsersNewPage />} />
          </Route>
          <Route element={<CapabilityRoute check={(c) => c.users.read} />}>
            <Route path="roles" element={<RolesListPage />} />
            <Route path="roles/new" element={<RolesNewPage />} />
            <Route path="roles/:role" element={<RolesDetailPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
