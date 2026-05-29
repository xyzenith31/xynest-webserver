import { API_URL } from './ServicesConfiguration';

export const getActiveDevicesService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/devices`, {
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
    throw error.error || error.message || 'Gagal mengambil daftar perangkat';
  }
};

export const revokeDeviceSessionService = async (deviceId: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/devices/${deviceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  } catch (error: any) {
    throw error.error || error.message || 'Gagal menghapus sesi perangkat';
  }
};

export const checkQRStatusService = async (qrToken: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/qr/status/${qrToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  } catch (error: any) {
    throw error.error || error.message || 'Gagal memeriksa status QR Code';
  }
};

export const generateQRTokenService = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/qr/generate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  } catch (error: any) {
    throw error.error || error.message || 'Gagal membuat token QR';
  }
};