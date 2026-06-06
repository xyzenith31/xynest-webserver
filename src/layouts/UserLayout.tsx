import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Beranda', path: '/user/home' },
    { name: 'Profil Saya', path: '/user/profile' },
    { name: 'Pengaturan', path: '/user/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased">
      <aside className={`w-64 bg-white border-r border-slate-100 flex-col py-6 px-4 gap-6 shrink-0 md:flex ${mobileMenuOpen ? 'flex fixed inset-y-0 left-0 z-50 w-64 shadow-xl' : 'hidden'}`}>
        <div className="flex items-center justify-between px-3">
          <div className="text-xl font-bold text-indigo-600 tracking-tight">Xynest User</div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <nav className="flex flex-col gap-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <button 
            onClick={() => navigate('/login')}
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            Keluar Sesi
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 md:hidden" />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-100 h-16 flex items-center px-6 justify-between shrink-0 sticky top-0 z-30">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            ☰
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-800">Vicky Marshall</span>
              <span className="text-xs text-slate-500 font-medium">User Member</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-indigo-200">
              V
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;