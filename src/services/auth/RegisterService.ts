import { API_URL } from './ServicesConfiguration';

export const RegisterService = {
  registerUser: async (userData: {
    username: string;
    email: string;
    full_name: string;
    phone_number: string;
    gender: string;
    birth_date: string;
  }) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error: any) {
      throw error.error || error.message || 'Gagal melakukan pendaftaran akun';
    }
  },

  resendCode: async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register-resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    } catch (error: any) {
      throw error.error || error.message || 'Gagal mengirim ulang kode OTP';
    }
  }
};