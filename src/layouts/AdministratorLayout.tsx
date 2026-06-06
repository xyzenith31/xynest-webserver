import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const AdministratorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenu = [
    { name: 'Dashboard Utama', path: '/admin/dashboard' },
    { name: 'Sistem Pemblokiran (Ban)', path: '/admin/banned' },
    { name: 'Manajemen Pengguna', path: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex antialiased">
      <aside className="w-68 bg-slate-900 text-slate-300 flex flex-col py-6 px-4 gap-6 shrink-0 shadow-xl">
        <div className="px-3 py-2">
          <div className="text-lg font-bold text-white tracking-wide">Xynest Admin</div>
          <p className="text-xs text-indigo-400 font-medium mt-0.5">Administrator System</p>
        </div>

        <nav className="flex flex-col gap-1 mt-4">
          {adminMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800">
          <div className="px-4 py-3 mb-3 bg-slate-800/40 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">Admin-Vicky</span>
              <span className="text-[10px] text-slate-500 truncate">Root Administrator</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            Keluar Panel
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdministratorLayout;