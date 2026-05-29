import { API_URL } from './ServicesConfiguration';

export const RegisterService = {
  register: async (data: { email: string; username: string; full_name: string; gender: string }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
  resendCode: async (email: string) => {
    const res = await fetch(`${API_URL}/auth/resend-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  }
};