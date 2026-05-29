import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VerifyService } from '../../services/auth/VerifyService';
import { RegisterService } from '../../services/auth/RegisterService';
import { requestLoginService, verifyLoginService } from '../../services/auth/LoginService';

export default function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || ''; 
  const type = searchParams.get('type') || 'login';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(formatted);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length < 6) {
      alert("Kode OTP harus 6 digit.");
      return;
    }

    setLoading(true);
    try {
      let res: any; 
      if (type === 'login') {
        res = await verifyLoginService(email, code);
      } else {
        res = await VerifyService.verifyCode(email, code);
      }

      if (res.success) {
        if (res.session_token) localStorage.setItem('session_token', res.session_token);
        navigate('/home');
      } else {
        alert(res.error || 'Kode verifikasi salah.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || err as string); 
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (type === 'login') {
        await requestLoginService(email);
      } else {
        await RegisterService.resendCode(email);
      }
      alert('Kode verifikasi baru telah dikirim!');
    } catch (err: any) {
      alert(err.message || err as string);
    }
  };

  return (
    <div className="space-y-6 flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h3 className="text-xl font-bold text-center mb-2">Verifikasi Kode</h3>
        <p className="text-sm text-gray-400 text-center mb-6">Kode telah dikirim ke {email}</p>
        
        <form onSubmit={handleVerify} className="space-y-4">
          <input 
            type="text" 
            required 
            maxLength={6}
            value={code}
            onChange={handleCodeChange}
            placeholder="XXXXXX" 
            className="w-full border border-gray-600 bg-gray-900 rounded-lg p-3 text-center text-2xl tracking-widest uppercase font-bold text-white focus:outline-none focus:border-indigo-500" 
          />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 font-bold transition disabled:opacity-50">
            {loading ? 'Memverifikasi...' : 'Verifikasi'}
          </button>
        </form>
        
        <div className="text-sm text-center mt-6 text-gray-400">
          Belum menerima kode?{' '}
          <button type="button" onClick={handleResend} className="font-medium text-indigo-400 hover:text-indigo-300">
            Kirim Ulang
          </button>
        </div>
      </div>
    </div>
  );
}