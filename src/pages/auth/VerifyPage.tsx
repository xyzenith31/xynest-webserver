import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VerifyService } from '../../services/auth/VerifyService';
import { LoginService } from '../../services/auth/LoginService';
import { RegisterService } from '../../services/auth/RegisterService';

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
      let res;
      if (type === 'login') {
        res = await LoginService.verifyLogin(email, code);
      } else {
        res = await VerifyService.verifyCode(email, code);
      }

      if (res.success) {
        if (res.session_token) localStorage.setItem('token', res.session_token);
        navigate('/home');
      } else {
        alert(res.error || 'Kode verifikasi salah.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (type === 'login') {
        await LoginService.requestLogin(email);
      } else {
        await RegisterService.resendCode(email);
      }
      alert('Kode verifikasi baru telah dikirim!');
    } catch (err) {
      alert('Gagal mengirim ulang kode.');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-center">Verifikasi Kode</h3>
      <p className="text-sm text-gray-500 text-center">Kode telah dikirim ke {email}</p>
      
      <form onSubmit={handleVerify} className="space-y-4">
        <input 
          type="text" 
          required 
          maxLength={6}
          value={code}
          onChange={handleCodeChange}
          placeholder="XXXXXX" 
          className="w-full border rounded-md p-3 text-center text-2xl tracking-widest uppercase font-bold text-gray-800" 
        />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-md p-2 font-medium">
          {loading ? 'Memverifikasi...' : 'Verifikasi'}
        </button>
      </form>
      
      <div className="text-sm text-center mt-4">
        Belum menerima kode?{' '}
        <button onClick={handleResend} className="font-medium text-blue-600 hover:text-blue-500">
          Kirim Ulang
        </button>
      </div>
    </div>
  );
}