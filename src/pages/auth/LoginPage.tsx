import React, { useState, useEffect } from 'react';
import QRCodeLib from 'react-qr-code';
import { useNavigate, Link } from 'react-router-dom';
import { requestLoginService, getClientDeviceInfo } from '../../services/auth/LoginService';
import { generateQRTokenService, checkQRStatusService } from '../../services/auth/DeviceService';

const QRCodeComponent = (QRCodeLib as any).default || QRCodeLib;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<'FORM' | 'QR'>('FORM');
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrToken, setQrToken] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return setError('Harap isi form login Anda');
    setError('');
    setLoading(true);
    try {
      const res = await requestLoginService(identifier);
      if (res.success) {
        navigate(`/verify?email=${encodeURIComponent(res.email)}&type=login`);
      }
    } catch (err: any) {
      if (err.is_banned) {
        setError(`Akun ditangguhkan: ${err.ban_details?.reason}`);
      } else {
        setError(err.error || err.message || 'Terjadi kesalahan sistem');
      }
    } finally {
      setLoading(false);
    }
  };

  const initQRCodeLogin = async () => {
    setError('');
    try {
      const res = await generateQRTokenService();
      if (res.success) {
        setQrToken(res.qr_token);
      }
    } catch (err: any) {
      setError('Gagal memuat QR Code login');
    }
  };

  useEffect(() => {
    if (loginMode === 'QR') {
      initQRCodeLogin();
    }
  }, [loginMode]);

  useEffect(() => {
    if (loginMode !== 'QR' || !qrToken) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await checkQRStatusService(qrToken);
        if (res.success && res.status === 'AUTHORIZED' && res.session_token) {
          clearInterval(intervalId);
          localStorage.setItem('session_token', res.session_token);
          
          const userRole = res.user?.role || res.role || 'users';
          if (userRole === 'administrator') {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/home');
          }
        }
      } catch (err: any) {
        clearInterval(intervalId);
        setQrToken('');
        if (err.is_banned) {
          setError(`Akun ditangguhkan: ${err.ban_details?.reason}`);
        } else {
          setError('QR Code telah kadaluarsa, silakan muat ulang halaman.');
        }
      }
    }, 3000); 

    return () => clearInterval(intervalId);
  }, [loginMode, qrToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-indigo-400 mb-6">
          {loginMode === 'FORM' ? 'Masuk ke Akun' : 'Masuk Lewat QR'}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {loginMode === 'FORM' && (
          <div>
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email / Username / No HP</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: @username atau email@domain.com"
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Mengirim Kode...' : 'Minta Kode OTP'}
              </button>
            </form>
          </div>
        )}

        {loginMode === 'QR' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {qrToken ? (
              <div className="flex justify-center items-center bg-white p-4 rounded-lg shadow-sm w-fit mx-auto">
                <QRCodeComponent
                  value={JSON.stringify({ 
                    type: 'xy_login', 
                    token: qrToken,
                    ...getClientDeviceInfo() 
                  })}
                  size={256}
                  level="H"
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10">
                <p>Memuat QR Code...</p>
              </div>
            )}
            <p className="text-xs text-gray-400 text-center max-w-xs">
              Buka aplikasi seluler kamu, arahkan kamera pemindai ke kode di atas untuk sinkronisasi sesi masuk perangkat otomatis.
            </p>
            <button
              onClick={initQRCodeLogin}
              className="text-xs text-indigo-400 hover:underline"
            >
              Muat Ulang QR Baru
            </button>
          </div>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
          <div className="relative flex justify-center text-sm"><span className="bg-gray-800 px-2 text-gray-400">Atau Pilihan Lain</span></div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setLoginMode(loginMode === 'FORM' ? 'QR' : 'FORM')}
            className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 transition font-medium py-2 px-4 rounded-lg text-sm"
          >
            {loginMode === 'FORM' ? 'Masuk Menggunakan QR Code' : 'Kembali ke Form Email'}
          </button>

          <p className="text-sm text-center text-gray-400 mt-2">
            Belum punya akun?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;