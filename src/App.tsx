import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyPage from './pages/auth/VerifyPage';

import UserLayout from './layouts/UserLayout';
import HomescreenPage from './pages/other/HomescreenPage';
import AdministratorLayout from './layouts/AdministratorLayout';
import DashboardPage from './pages/other/DashboardPage';
import BannedAdministratorPage from './pages/admin/BannedAdministratorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />

        <Route path="/user" element={<UserLayout />}>
          <Route path="home" element={<HomescreenPage />} />
          <Route path="profile" element={<div className="bg-white p-6 rounded-2xl border border-slate-200">Halaman Profil Terbuka Secara Vertikal</div>} />
          <Route path="settings" element={<div className="bg-white p-6 rounded-2xl border border-slate-200">Halaman Pengaturan</div>} />
        </Route>

        <Route path="/admin" element={<AdministratorLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="banned" element={<BannedAdministratorPage />} />
          <Route path="users" element={<div className="bg-white p-6 rounded-2xl border border-slate-200">Manajemen Data Pengguna</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;