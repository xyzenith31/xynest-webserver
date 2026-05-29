import { API_URL } from './ServicesConfiguration';

export const LoginService = {
  requestLogin: async (identifier: string) => {
    const res = await fetch(`${API_URL}/auth/login-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    return res.json();
  },
  
  verifyLogin: async (identifier: string, code: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // GANTI 'code' menjadi 'otp_code' biar dikenali backend
      body: JSON.stringify({ identifier, otp_code: code }), 
    });
    return res.json();
  },
  
  generateQR: async () => {
    const res = await fetch(`${API_URL}/auth/qr/generate`);
    return res.json();
  },
  
  checkQRStatus: async (qrToken: string) => {
    const res = await fetch(`${API_URL}/auth/qr/status/${qrToken}`);
    return res.json();
  }
};