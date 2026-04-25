import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AccountForm } from './AccountForm';
import { api } from '../services/api';
import * as bankUtils from '../utils/bank';

// Mock the API
vi.mock('../services/api', () => ({
  api: {
    addAccount: vi.fn(),
    updateAccount: vi.fn(),
    getAccount: vi.fn(),
    deleteAccount: vi.fn(),
  },
}));

// Mock confirm dialogue
window.confirm = vi.fn();

describe('AccountForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (path = '/add', initialEntry = '/add') => {
    render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/add" element={<AccountForm />} />
          <Route path="/id/:id" element={<AccountForm />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders add account title and inputs initially', () => {
    renderComponent();
    expect(screen.getByText('Add favorite account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E.g. Bridge Foundation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ES50...')).toBeInTheDocument();
    // Bank input should be disabled
    const bankInput = screen.getAllByRole('textbox')[2];
    expect(bankInput).toBeDisabled();
    
    // Check if Delete button is absent
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('validates IBAN on typing and shows errors initially if incorrect', async () => {
    renderComponent();
    const ibanInput = screen.getByPlaceholderText('ES50...');
    
    // Simulate calculateBankFromIBAN throwing error
    vi.spyOn(bankUtils, 'calculateBankFromIBAN').mockImplementationOnce(() => {
      throw new Error('Invalid Bank Code');
    });
    
    fireEvent.change(ibanInput, { target: { value: '12345678' } });
    
    // Force rerender or wait for effect
    await waitFor(() => {
      // It should display invalid bank code somewhere if logic catches it
      // In AccountForm, errorString gets populated
      expect(screen.getByText('Invalid Bank Code')).toBeInTheDocument();
    });
  });

  it('disables save button when fields are missing', () => {
    renderComponent();
    const saveBtn = screen.getByText('Save');
    expect(saveBtn).toBeDisabled();
  });

  it('fetches existing account details in edit mode', async () => {
    (api.getAccount as any).mockResolvedValue({ 
      name: 'Existing Acc', 
      iban: 'ES123412341234', 
      bank: 'Test Bank' 
    });

    renderComponent('/id/:id', '/id/1');

    expect(screen.getByText('Edit favorite account')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();

    await waitFor(() => {
      // Inputs should have values
      const nameInput = screen.getByPlaceholderText('E.g. Bridge Foundation');
      expect((nameInput as HTMLInputElement).value).toBe('Existing Acc');
      
      const ibanInput = screen.getByPlaceholderText('ES50...');
      expect((ibanInput as HTMLInputElement).value).toBe('ES123412341234');
    });
  });
});
