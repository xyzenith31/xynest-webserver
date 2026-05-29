// src/services/ServicesConfiguration.ts

const PRODUCTION_URL = ""; // Isi URL production di sini jika sudah deploy

const getBaseUrl = (): string => {
  if (PRODUCTION_URL) return PRODUCTION_URL;
  
  // Karena ini di web browser (Vite), kita bisa ambil hostname secara dinamis.
  // Jika diakses di PC lokal akan jadi 'localhost',
  // Jika diakses di HP (satu jaringan) akan jadi IP address (misal 192.168.x.x)
  const hostname = window.location.hostname;
  return `http://${hostname}:3000`; // Sesuaikan port dengan port backend express kamu
};

export const ENVIRONMENT = PRODUCTION_URL ? 'production' : 'development';
export const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api`;

console.log(`[XyNest Config] Mode: ${ENVIRONMENT} | Base API: ${API_URL}`);