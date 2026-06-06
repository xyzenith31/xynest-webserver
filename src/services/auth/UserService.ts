import { BASE_URL } from './ServicesConfiguration';

export const getUserProfile = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw data;
    
    return data;
  } catch (error: any) {
    if (error.is_banned) throw error;
    throw error.error || error.message || 'Gagal mengambil data pengguna';
  }
};