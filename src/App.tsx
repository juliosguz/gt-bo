import { Routes, Route } from 'react-router';
import Layout from './components/layout';
import DashboardPage from './pages/dashboard';
import StoresListPage from './pages/stores/index';
import StoresNewPage from './pages/stores/new';
import StoresEditPage from './pages/stores/edit';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="stores" element={<StoresListPage />} />
        <Route path="stores/new" element={<StoresNewPage />} />
        <Route path="stores/:id/edit" element={<StoresEditPage />} />
      </Route>
    </Routes>
  );
}
