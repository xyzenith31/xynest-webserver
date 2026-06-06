import { API_URL } from './ServicesConfiguration';

export const VerifyService = {
  verifyCode: async (email: string, code: string, type: string = 'register') => {
    const endpoint = type === 'login' 
      ? `${API_URL}/auth/login` 
      : `${API_URL}/auth/verify-register`;

    const payload = type === 'login'
      ? { identifier: email, otp_code: code }
      : { email: email, otp_code: code };

    const res = await fetch(endpoint, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), 
    });
  
    const data = await res.json();
    
    if (!res.ok) {
      throw data;
    }
    
    return data;
  }
};