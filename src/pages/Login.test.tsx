import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './Login';
import { api } from '../services/api';
import * as cryptoUtils from '../utils/crypto';

vi.mock('../services/api', () => ({
  api: {
    requestOtp: vi.fn(),
    login: vi.fn(),
  },
}));

vi.mock('../utils/crypto', () => ({
  hashString: vi.fn(),
}));

vi.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  };

  it('renders step 1 initially', () => {
    renderComponent();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Customer ID')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('transitions to step 2 when OTP request is successful', async () => {
    (api.requestOtp as any).mockResolvedValue({ success: true });
    
    renderComponent();
    
    const input = screen.getByPlaceholderText('Enter your Customer ID');
    fireEvent.change(input, { target: { value: 'CUST001' } });
    
    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter the OTP sent to your mobile')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  it('verifies OTP and navigates on success', async () => {
    (api.requestOtp as any).mockResolvedValue({ success: true });
    (api.login as any).mockResolvedValue({ success: true, token: 'fake-token' });
    (cryptoUtils.hashString as any).mockResolvedValue('hashed-otp');
    
    renderComponent();
    
    // Step 1
    fireEvent.change(screen.getByPlaceholderText('Enter your Customer ID'), { target: { value: 'CUST001' } });
    fireEvent.click(screen.getByText('Next'));
    
    // Wait for step 2
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter the OTP sent to your mobile')).toBeInTheDocument();
    });
    
    // Step 2
    fireEvent.change(screen.getByPlaceholderText('Enter the OTP sent to your mobile'), { target: { value: '1234' } });
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('customerId')).toBe('CUST001');
    });
  });

  it('shows error if OTP request fails', async () => {
    (api.requestOtp as any).mockRejectedValue(new Error('User not found'));
    
    renderComponent();
    
    fireEvent.change(screen.getByPlaceholderText('Enter your Customer ID'), { target: { value: 'INVALID' } });
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });
});
