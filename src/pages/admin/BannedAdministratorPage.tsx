import React, { useEffect, useState } from 'react';
import { BannedService, UserAdmin, BanAppeal, BanPayload } from '../../services/admin/BannedService';

const BannedAdministratorPage = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'appeals'>('users');
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [appeals, setAppeals] = useState<BanAppeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [banForm, setBanForm] = useState<Omit<BanPayload, 'user_id'>>({
    reason: '',
    duration_value: 1,
    duration_unit: 'days'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await BannedService.getUsersList();
        if (res.success) setUsers(res.data);
      } else {
        const res = await BannedService.getAppeals();
        if (res.success) setAppeals(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      alert('Gagal mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  };

  const handleBanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const payload: BanPayload = {
        user_id: selectedUser.id,
        ...banForm
      };
      
      const res = await BannedService.banUser(payload);
      if (res.success) {
        alert('Pengguna berhasil diblokir!');
        setSelectedUser(null);
        setBanForm({ reason: '', duration_value: 1, duration_unit: 'days' });
        fetchData();
      } else {
        alert(res.error || 'Terjadi kesalahan saat memblokir.');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal memblokir pengguna.');
    }
  };

  const handleUnban = async (userId: string, username: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin mencabut status banned untuk ${username}?`)) return;

    try {
      const res = await BannedService.unbanUser({ user_id: userId });
      if (res.success) {
        alert('Status banned berhasil dicabut!');
        fetchData();
      } else {
        alert(res.error || 'Terjadi kesalahan saat mencabut ban.');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal mencabut status pengguna.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800">Sistem Pemblokiran (Ban)</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola akses pengguna dan tinjau banding.</p>
        </div>
        <div className="flex px-6 gap-6 bg-slate-50 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('users')}
            className={`py-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'users' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Daftar Pengguna
          </button>
          <button 
            onClick={() => setActiveTab('appeals')}
            className={`py-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'appeals' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Pengajuan Banding (Appeals)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? (
          <div className="py-10 text-center text-slate-500">Memuat data...</div>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 rounded-tl-lg">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-tr-lg">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        user.status === 'BANNED' ? 'bg-rose-100 text-rose-700' : 
                        user.status === 'APPEAL' ? 'bg-amber-100 text-amber-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.role !== 'admin' && (
                        <>
                          {user.status === 'ACTIVE' ? (
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Ban User
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleUnban(user.id, user.username)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Cabut Ban
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-6">Tidak ada data pengguna.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 rounded-tl-lg">Pengguna</th>
                  <th className="py-3 px-4">Alasan Pemblokiran</th>
                  <th className="py-3 px-4">Alasan Banding (Singkat)</th>
                  <th className="py-3 px-4">Penjelasan Banding</th>
                  <th className="py-3 px-4 text-right rounded-tr-lg">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appeals.map((appeal) => (
                  <tr key={appeal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{appeal.users?.username}</div>
                      <div className="text-xs text-slate-400">{appeal.users?.email}</div>
                    </td>
                    <td className="py-3 px-4 text-rose-600">{appeal.reason}</td>
                    <td className="py-3 px-4">{appeal.appeal_reason}</td>
                    <td className="py-3 px-4 max-w-xs truncate" title={appeal.appeal_text}>{appeal.appeal_text}</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleUnban(appeal.user_id, appeal.users?.username)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Terima (Cabut Ban)
                      </button>
                    </td>
                  </tr>
                ))}
                {appeals.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-6">Tidak ada data banding yang pending.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Blokir {selectedUser.username}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleBanSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alasan Ban</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  placeholder="Misal: Pelanggaran komunitas..."
                  value={banForm.reason}
                  onChange={(e) => setBanForm({...banForm, reason: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Durasi</label>
                  <input 
                    type="number" 
                    required min={1}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    value={banForm.duration_value}
                    onChange={(e) => setBanForm({...banForm, duration_value: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Satuan Waktu</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    value={banForm.duration_unit}
                    onChange={(e) => setBanForm({...banForm, duration_unit: e.target.value as any})}
                  >
                    <option value="minutes">Menit</option>
                    <option value="hours">Jam</option>
                    <option value="days">Hari</option>
                    <option value="weeks">Minggu</option>
                    <option value="months">Bulan</option>
                    <option value="years">Tahun</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedUser(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-rose-600/20">
                  Konfirmasi Ban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannedAdministratorPage;