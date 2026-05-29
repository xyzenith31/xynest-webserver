import { API_URL } from './ServicesConfiguration';

export const VerifyService = {
  verifyCode: async (email: string, code: string) => {
    const res = await fetch(`${API_URL}/auth/verify-register`, { // Sesuaikan route verify register kamu
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // GANTI 'code' menjadi 'otp_code' 
      body: JSON.stringify({ email, otp_code: code }), 
    });
    return res.json();
  }
};