import { UAParser } from 'ua-parser-js';
import { BASE_URL } from './ServicesConfiguration';


export const getClientDeviceInfo = () => {
  const parser = new UAParser();
  const result = parser.getResult();

  const deviceModel = result.device.model || result.browser.name || 'Unknown Web Device';
  
  let platform = 'Browser';
  if (result.os.name === 'Android') platform = 'Android';
  else if (result.os.name === 'iOS') platform = 'iOS';
  else if (result.os.name) platform = `${result.os.name} Desktop`;

  const osVersion = result.os.name && result.os.version 
    ? `${result.os.name} ${result.os.version}` 
    : result.os.name || 'Unknown OS';

  return {
    device_model: deviceModel,
    platform: platform,
    os_version: osVersion
  };
};

export const requestLoginService = async (identifier: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier }),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  } catch (error: any) {
    throw error.error || error.message || 'Gagal memproses permintaan login';
  }
};

export const verifyLoginService = async (email: string, otpCode: string) => {
  try {
    const deviceInfo = getClientDeviceInfo();
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp_code: otpCode,
        ...deviceInfo 
      }),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  } catch (error: any) {
    throw error.error || error.message || 'Verifikasi OTP gagal';
  }
};  
