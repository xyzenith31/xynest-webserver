import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VerifyService } from '../../services/auth/VerifyService';
import { RegisterService } from '../../services/auth/RegisterService';

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || ''; 
  const type = searchParams.get('type') || 'login'; 
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) return setError('Masukkan 6 digit OTP');
    setError('');
    setLoading(true);

    try {
      // PERBAIKAN: Tambahkan parameter "type" di pemanggilan fungsinya
      const res = await VerifyService.verifyCode(email, code, type);

      if (res.success || res.session_token) {
        if (res.session_token) {
          localStorage.setItem('session_token', res.session_token);
        }
        
        if (type === 'register') {
          navigate('/user/home'); 
        } else {
          const userRole = res.user?.role || res.role || 'users';
          navigate(userRole === 'administrator' ? '/admin/dashboard' : '/user/home');
        }
      }
    } catch (err: any) {
      if (err.is_banned) {
        setError(`Akun Dilarang: ${err.ban_details?.reason}`);
      } else {
        setError(err.message || err.error || 'Kode verifikasi salah.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await RegisterService.resendCode(email);
      alert('Kode verifikasi baru telah dikirim!');
    } catch (err: any) {
      setError(err.message || err.error || 'Gagal kirim ulang OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-indigo-400 mb-2">
          Verifikasi OTP
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Kode telah dikirim ke <b>{email}</b>
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input 
              type="text" 
              required 
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="000000" 
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-center text-2xl tracking-widest font-bold text-white focus:outline-none focus:border-indigo-500" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-green-600 hover:bg-green-700 transition font-bold py-3 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi Akun'}
          </button>
        </form>
        
        <div className="text-sm text-center mt-6 text-gray-400">
          Belum menerima kode?{' '}
          <button type="button" onClick={handleResend} className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
            Kirim Ulang
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;