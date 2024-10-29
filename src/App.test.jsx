import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import ListingsPage from './ListingsPage';

vi.mock('react-router-dom', () => {
  const originalModule = vi.importActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: vi.fn(),
    MemoryRouter: ({ children }) => <div>{children}</div>
  };
});

const mockUser = {
  uid: 'test-user-id'
};

describe('my postings navigation', () => {
  it('navigates to my postings page on My Postings button click', () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockImplementation(() => navigate);

    render(<ListingsPage user={mockUser} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText('My Postings'));

    expect(navigate).toHaveBeenCalledWith('/my-postings');
  });
});
