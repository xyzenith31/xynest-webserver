import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { LoginService } from '../../services/auth/LoginService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(false);

  // Fungsi untuk Load QR
  const fetchQR = async () => {
    try {
      const res = await LoginService.generateQR();
      if (res.success) setQrToken(res.qr_token);
    } catch (err) {
      console.error('Gagal memuat QR', err);
    }
  };

  useEffect(() => {
    fetchQR();
  }, []);

  // Polling mengecek status QR Code
  useEffect(() => {
    if (!qrToken) return;

    const interval = setInterval(async () => {
      try {
        const res = await LoginService.checkQRStatus(qrToken);
        if (res.status === 'AUTHORIZED' && res.session_token) {
          localStorage.setItem('token', res.session_token);
          clearInterval(interval);
          navigate('/home');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000); // Cek setiap 3 detik

    return () => clearInterval(interval);
  }, [qrToken, navigate]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await LoginService.requestLogin(identifier);
      if (res.success) {
        // Arahkan ke halaman verifikasi untuk input kode OTP
        navigate(`/verify?email=${encodeURIComponent(res.email || identifier)}&type=login`);
      } else {
        alert(res.error || 'Gagal login');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-center">Masuk ke XyNest</h3>
      
      {/* QR Code Section */}
      <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
        <p className="text-sm text-gray-500 mb-4 text-center">Scan QR Code menggunakan aplikasi mobile XyNest kamu</p>
        {qrToken ? (
          <QRCodeSVG value={qrToken} size={200} />
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-lg"></div>
        )}
        <button onClick={fetchQR} className="mt-4 text-sm text-blue-600 hover:underline">
          Muat Ulang QR
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Atau masuk manual</span></div>
      </div>

      {/* Manual Login Section */}
      <form onSubmit={handleManualLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email / Username / No. HP</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Masukkan identitas kamu"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Memproses...' : 'Kirim Kode Masuk'}
        </button>
      </form>
      <div className="text-sm text-center">
        Belum punya akun? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Daftar sekarang</Link>
      </div>
    </div>
  );
}