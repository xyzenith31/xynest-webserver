import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterService } from '../../services/auth/RegisterService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    phone_number: '',
    gender: 'PRIA',
    birth_date: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.full_name || !formData.phone_number || !formData.birth_date) {
      return setError('Semua kolom wajib diisi.');
    }

    setLoading(true);
    try {
      let formattedUsername = formData.username.trim();
      if (!formattedUsername.startsWith('@')) {
        formattedUsername = '@' + formattedUsername;
      }

      let formattedPhone = formData.phone_number.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+62' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      const dateParts = formData.birth_date.split('-');
      let formattedDate = formData.birth_date;
      if (dateParts.length === 3) {
        formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }

      const res = await RegisterService.registerUser({
        username: formattedUsername,
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        phone_number: formattedPhone,
        gender: formData.gender,
        birth_date: formattedDate
      });

      if (res.success) {
        navigate(`/verify?email=${encodeURIComponent(formData.email.trim())}&type=register`);
      }
    } catch (err: any) {
      setError(err || 'Terjadi kesalahan saat mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 py-8">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-indigo-400 mb-6">
          Buat Akun Baru
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Nama Lengkap</label>
            <input 
              type="text" 
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Masukkan nama lengkap"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Username</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Contoh: user_keren123 (tanpa @)"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Email Aktif</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="email@domain.com"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Nomor Ponsel</label>
            <input 
              type="tel" 
              value={formData.phone_number}
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="0812xxxxxxx"
              disabled={loading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Gender</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                disabled={loading}
              >
                <option value="PRIA">Pria</option>
                <option value="WANITA">Wanita</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Tanggal Lahir</label>
              <input 
                type="date" 
                value={formData.birth_date}
                onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                disabled={loading}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition font-bold py-3 px-4 rounded-lg disabled:opacity-50 mt-4"
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors">
            Masuk Disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;