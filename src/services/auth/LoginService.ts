import { UAParser } from 'ua-parser-js';
import { BASE_URL } from './ServicesConfiguration';


export const getClientDeviceInfo = () => {
  const parser = new UAParser();
  const result = parser.getResult();
  
  let browserName = result.browser.name || 'Web';
  
  if (browserName.toLowerCase().includes('electron') || browserName === 'Chromium') {
    const ua = window.navigator.userAgent || '';
    if (ua.includes('Edg/')) {
      browserName = 'Edge';
    } else if (ua.includes('Chrome/')) {
      browserName = 'Chrome';
    } else if (ua.includes('Firefox/')) {
      browserName = 'Firefox';
    } else if (ua.includes('Safari/')) {
      browserName = 'Safari';
    } else {
      browserName = 'Chrome';
    }
  }

  if (browserName.endsWith(' Browser')) {
    browserName = browserName.replace(' Browser', '');
  }
  
  const deviceModel = result.device.model 
    ? `${result.device.model} (${browserName})` 
    : browserName;

  let platform = 'Website'; 
  if (result.os.name === 'Android') platform = 'Android';
  else if (result.os.name === 'iOS') platform = 'iOS';

  let osVersion = 'Unknown OS';
  const rawOsName = result.os.name || '';
  
  if (rawOsName.toLowerCase().includes('windows')) {
    osVersion = 'Windows';
  } else if (rawOsName.toLowerCase().includes('mac os') || rawOsName.toLowerCase().includes('macos')) {
    osVersion = 'macOS';
  } else if (rawOsName.toLowerCase().includes('linux')) {
    osVersion = 'Linux';
  } else if (rawOsName.toLowerCase().includes('ubuntu')) {
    osVersion = 'Linux';
  } else if (rawOsName === 'iOS') {
    osVersion = 'iOS';
  } else if (rawOsName === 'Android') {
    osVersion = 'Android';
  } else {
    osVersion = rawOsName || 'Unknown OS';
  }

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
