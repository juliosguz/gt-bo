import { Routes, Route } from 'react-router';
import Layout from './components/layout';
import ProtectedRoute from './components/protected-route';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import StoresListPage from './pages/stores/index';
import StoresNewPage from './pages/stores/new';
import StoresEditPage from './pages/stores/edit';

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="stores" element={<StoresListPage />} />
          <Route path="stores/new" element={<StoresNewPage />} />
          <Route path="stores/:id/edit" element={<StoresEditPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
