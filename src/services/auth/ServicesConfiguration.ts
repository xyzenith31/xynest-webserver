const PRODUCTION_URL = ""; 

const getBaseUrl = (): string => {
  if (PRODUCTION_URL) return PRODUCTION_URL;
  
  const hostname = window.location.hostname || 'localhost';
  
  return `http://${hostname}:3000`;
};

export const ENVIRONMENT = PRODUCTION_URL ? 'production' : 'development';
export const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api`; 

console.log(`[XyNest Config] Mode: ${ENVIRONMENT} | Base API: ${API_URL}`);