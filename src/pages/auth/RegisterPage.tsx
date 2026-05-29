import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterService } from '../../services/auth/RegisterService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    gender: 'pria'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await RegisterService.register(formData);
      if (res.success) {
        navigate(`/verify?email=${encodeURIComponent(formData.email)}&type=register`);
      } else {
        alert(res.error || 'Gagal mendaftar');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-center">Daftar Akun XyNest</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" required className="w-full border rounded-md p-2" 
          onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <input type="text" placeholder="Username" required className="w-full border rounded-md p-2" 
          onChange={e => setFormData({...formData, username: e.target.value})} />
        
        <input type="text" placeholder="Nama Lengkap" required className="w-full border rounded-md p-2" 
          onChange={e => setFormData({...formData, full_name: e.target.value})} />
        
        <select className="w-full border rounded-md p-2" 
          onChange={e => setFormData({...formData, gender: e.target.value})} value={formData.gender}>
          <option value="pria">Pria</option>
          <option value="wanita">Wanita</option>
          <option value="rahasia">Tidak ingin menyebutkan</option>
        </select>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-md p-2 font-medium">
          {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
        </button>
      </form>
      <div className="text-sm text-center">
        Sudah punya akun? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Masuk di sini</Link>
      </div>
    </div>
  );
}