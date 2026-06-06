const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Dashboard Administrator</h1>
        <p className="text-sm text-slate-500 mt-0.5">Selamat datang kembali di panel pusat kendali web server Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengguna</span>
          <div className="text-3xl font-bold text-slate-900 mt-1">1,248</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Akun Ditangguhkan</span>
          <div className="text-3xl font-bold text-rose-600 mt-1">14</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Banding Masuk</span>
          <div className="text-3xl font-bold text-amber-500 mt-1">3</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;