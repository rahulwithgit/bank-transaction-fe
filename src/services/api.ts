import type { Account, PaginatedResponse } from '../types';

// Mock DB removed since all endpoints are now integrated with real API

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
        body: JSON.stringify({ hash: hashedOtp, customerId }),
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
    
    const customerId = localStorage.getItem('customerId') || 'CUST001';
    const response = await fetchAuthenticated(`http://10.138.176.184:8080/api/v1/customers/${customerId}/favorite-accounts`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch favorite accounts with status: ${response.status}`);
    }

    const json = await response.json();
    
    // Safely handle different possible response formats (array vs object)
    let rawData: any[] = [];
    if (Array.isArray(json)) {
      rawData = json;
    } else if (json && Array.isArray(json.data)) {
      rawData = json.data;
    }

    // Map the backend properties to the frontend's expected Account interface
    const allData: Account[] = rawData.map((item, index) => ({
      id: item.id || item.iban || String(index),
      name: item.accountName || item.name || '',
      iban: item.iban || '',
      bank: item.bankName || item.bank || ''
    }));

    // Since the endpoint might not support pagination natively, we handle it client-side
    // to maintain compatibility with the UI's PaginatedResponse expectation.
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pagedData = allData.slice(start, end);

    return {
      data: pagedData,
      total: allData.length,
      page,
      pageSize
    };
  },

  getAccount: async (id: string): Promise<Account> => {
    checkAuth();
    
    // We expect the 'id' to be the IBAN since we map it as such in 'getAccounts'.
    const response = await fetchAuthenticated(`http://10.138.176.184/api/v1/bank/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch account details: ${response.status}`);
    }

    const data = await response.json();

    return {
      id: id,
      name: data.accountName || data.name || '',
      iban: data.iban || id,
      bank: data.bankName || data.bank || ''
    };
  },

  addAccount: async (accountData: Omit<Account, 'id'>): Promise<Account> => {
    checkAuth();
    const customerId = localStorage.getItem('customerId') || 'CUST001';
    
    const response = await fetchAuthenticated(`http://10.138.176.184:8080/api/v1/customers/${customerId}/favorite-accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountName: accountData.name,
        iban: accountData.iban,
        bankName: accountData.bank
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add favorite account with status: ${response.status}`);
    }

    // Try to parse the response to extract the new account, or return a fake response based on submitted data
    let newAccount: any = {};
    const textResponse = await response.text();
    if (textResponse) {
      try {
        newAccount = JSON.parse(textResponse);
      } catch {
        // Ignored
      }
    }

    return {
      id: newAccount.id || Math.random().toString(36).substring(2, 9),
      name: newAccount.accountName || newAccount.name || accountData.name,
      iban: newAccount.iban || accountData.iban,
      bank: newAccount.bankName || newAccount.bank || accountData.bank
    };
  },

  updateAccount: async (id: string, accountData: Omit<Account, 'id'>): Promise<Account> => {
    checkAuth();
    const customerId = localStorage.getItem('customerId') || 'CUST001';
    
    const response = await fetchAuthenticated(`http://10.138.176.184:8080/api/v1/customers/${customerId}/favorite-accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountName: accountData.name,
        iban: accountData.iban,
        bankName: accountData.bank
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update favorite account with status: ${response.status}`);
    }

    let updatedAccount: any = {};
    const textResponse = await response.text();
    if (textResponse) {
      try {
        updatedAccount = JSON.parse(textResponse);
      } catch {
        // Ignored
      }
    }

    return {
      id: updatedAccount.id || id,
      name: updatedAccount.accountName || updatedAccount.name || accountData.name,
      iban: updatedAccount.iban || accountData.iban,
      bank: updatedAccount.bankName || updatedAccount.bank || accountData.bank
    };
  },

  deleteAccount: async (id: string): Promise<void> => {
    checkAuth();
    const customerId = localStorage.getItem('customerId') || 'CUST001';
    
    const response = await fetchAuthenticated(`http://10.138.176.184:8080/api/v1/customers/${customerId}/favorite-accounts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete favorite account with status: ${response.status}`);
    }
  }
};
