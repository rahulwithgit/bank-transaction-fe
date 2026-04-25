import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AccountsList } from './AccountsList';
import { api } from '../services/api';

// Mock the API calls
vi.mock('../services/api', () => ({
  api: {
    getAccounts: vi.fn(),
  },
}));

// Mock Lucide icons to prevent SVG rendering issues in JS DOM
vi.mock('lucide-react', () => ({
  Edit2: () => <div data-testid="edit-icon" />,
  Plus: () => <div data-testid="plus-icon" />
}));

describe('AccountsList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (api.getAccounts as any).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(
      <MemoryRouter>
        <AccountsList />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading accounts...')).toBeInTheDocument();
  });

  it('renders empty state when no accounts found', async () => {
    (api.getAccounts as any).mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 5 });
    
    render(
      <MemoryRouter>
        <AccountsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No favorite accounts found.')).toBeInTheDocument();
    });
  });

  it('renders a list of accounts when data is available', async () => {
    const mockAccounts = [
      { id: '1', name: 'John Doe', iban: 'ES1234', bank: 'Bank A' },
      { id: '2', name: 'Jane Smith', iban: 'ES5678', bank: 'Bank B' },
    ];
    
    (api.getAccounts as any).mockResolvedValue({ data: mockAccounts, total: 2, page: 1, pageSize: 5 });
    
    render(
      <MemoryRouter>
        <AccountsList />
      </MemoryRouter>
    );

    // Wait for the loading to disappear and the accounts to appear
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('ES1234')).toBeInTheDocument();
      expect(screen.getByText('Bank A')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});
