import type { Account, PaginatedResponse } from '../types';

// Mock DB
let accountsDB: Account[] = [
  { id: '1', name: 'Bridge Foundation', iban: 'ES50 1234 4954 4443 2222', bank: 'Nairobi Bank' },
  { id: '2', name: 'Ramón Curado García', iban: 'ES50 1235 4954 4443 2222', bank: 'Denver Bank' },
  { id: '3', name: 'Vodafone Spain', iban: 'ES50 1236 4954 4443 2222', bank: 'Moscow Bank' },
  { id: '4', name: 'Bridge Foundation', iban: 'ES50 1234 4954 4443 2222', bank: 'Nairobi Bank' },
  { id: '5', name: 'Ramón Curado García', iban: 'ES50 1235 4954 4443 2222', bank: 'Denver Bank' },
  { id: '6', name: 'Vodafone Spain', iban: 'ES50 1236 4954 4443 2222', bank: 'Moscow Bank' },
  { id: '7', name: 'Bridge Foundation', iban: 'ES50 1234 4954 4443 2222', bank: 'Nairobi Bank' },
  { id: '8', name: 'Ramón Curado García', iban: 'ES50 1235 4954 4443 2222', bank: 'Denver Bank' },
  { id: '9', name: 'Vodafone Spain', iban: 'ES50 1236 4954 4443 2222', bank: 'Moscow Bank' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthenticated API call. Bearer Token missing.');
};

// Utility function ready for when you swap mocked calls with real HTTP bindings 
export const fetchAuthenticated = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};

export const api = {
  requestOtp: async (customerId: string): Promise<{ success: boolean }> => {
    await delay(300);
    if (!customerId) throw new Error('Customer ID is required');
    return { success: true };
  },

  login: async (customerId: string, hashedOtp?: string): Promise<{ success: boolean; token: string }> => {
    if (!customerId) throw new Error('Customer ID is required');
    if (!hashedOtp) throw new Error('OTP is required');

    try {
      const response = await fetch('http://10.138.176.184:8080/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hash: hashedOtp }),
      });

      if (!response.ok) {
        throw new Error(`Login failed on server with status: ${response.status}`);
      }

      // Check whether backend returns raw token string or { token: "..." }
      let resolvedToken = '';
      const textResponse = await response.text();
      try {
        const jsonResponse = JSON.parse(textResponse);
        resolvedToken = jsonResponse.token || jsonResponse.accessToken || jsonResponse.bearerToken || textResponse;
      } catch {
        resolvedToken = textResponse; 
      }

      return { success: true, token: resolvedToken };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to execute login request.');
    }
  },

  getAccounts: async (page = 1, pageSize = 5): Promise<PaginatedResponse<Account>> => {
    checkAuth();
    await delay(300);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = accountsDB.slice(start, end);

    return {
      data,
      total: accountsDB.length,
      page,
      pageSize
    };
  },

  getAccount: async (id: string): Promise<Account> => {
    checkAuth();
    await delay(200);
    const account = accountsDB.find(a => a.id === id);
    if (!account) throw new Error('Account not found');
    return account;
  },

  addAccount: async (accountData: Omit<Account, 'id'>): Promise<Account> => {
    checkAuth();
    await delay(400);
    if (accountsDB.length >= 20) {
      throw new Error('Maximum of 20 favorite accounts allowed.');
    }
    const newAccount = { ...accountData, id: Math.random().toString(36).substring(2, 9) };
    accountsDB.unshift(newAccount);
    return newAccount;
  },

  updateAccount: async (id: string, accountData: Omit<Account, 'id'>): Promise<Account> => {
    checkAuth();
    await delay(400);
    const index = accountsDB.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Account not found');

    accountsDB[index] = { ...accountData, id };
    return accountsDB[index];
  },

  deleteAccount: async (id: string): Promise<void> => {
    checkAuth();
    await delay(300);
    accountsDB = accountsDB.filter(a => a.id !== id);
  }
};
