import { API_URL } from './ServicesConfiguration';

export const VerifyService = {
  verifyCode: async (email: string, code: string) => {
    const res = await fetch(`${API_URL}/auth/verify-register`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp_code: code }), 
    });
    return res.json();
  }
};