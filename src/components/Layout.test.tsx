import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './Layout';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('lucide-react', () => ({
  LogOut: () => <div data-testid="logout-icon" />,
  User: () => <div data-testid="user-icon" />,
}));

describe('Layout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders header title', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(screen.getByText('HCLTech')).toBeInTheDocument();
  });

  it('does not show logout if token is missing', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows logout if token is present', () => {
    localStorage.setItem('token', 'fake-token');
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('logs out and navigates when logout clicked', () => {
    localStorage.setItem('token', 'fake-token');
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Logout'));
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
