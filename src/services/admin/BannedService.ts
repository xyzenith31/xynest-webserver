import { API_URL } from '../auth/ServicesConfiguration';

export interface UserAdmin {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  gender: string;
  birth_date: string;
  role: string;
  status?: string; 
  ban_details?: any; 
}

export interface BanAppeal {
  id: string;
  user_id: string;
  reason: string;
  banned_at: string;
  expires_at: string;
  status: string;
  appeal_status: string;
  appeal_reason: string;
  appeal_text: string;
  users: {
    username: string;
    email: string;
    full_name: string;
  };
}

export interface BanPayload {
  user_id: string;
  reason: string;
  duration_value: number;
  duration_unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'; 
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('session_token') || ''; 
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const BannedService = {
  getUsersList: async () => {
    const response = await fetch(`${API_URL}/admin/users-list`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response.json();
  },

  banUser: async (payload: BanPayload) => {
    const response = await fetch(`${API_URL}/admin/ban`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  unbanUser: async (payload: { user_id: string }) => {
    const response = await fetch(`${API_URL}/admin/unban`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  getAppeals: async () => {
    const response = await fetch(`${API_URL}/admin/appeals`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return response.json();
  },
};