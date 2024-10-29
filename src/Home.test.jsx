import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { signInWithPopup, getAuth } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { vi } from 'vitest';
import Home from './Home';

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAuth: vi.fn(),
    signInWithPopup: vi.fn(),
  };
});

vi.mock('firebase/database', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ref: vi.fn(() => ({})),
    get: vi.fn(),
  };
});

const mockNavigate = vi.fn(); 

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate, 
  MemoryRouter: ({ children }) => <div>{children}</div>,
}));

describe('Home Component - Get Started Button', () => {
  const mockSetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAuth).mockReturnValue({});
  });

  it('should proceed to /listings if user is authenticated', async () => {
    const mockUser = { uid: 'testUser123' };
    const mockSnapshot = { exists: () => true };

    vi.mocked(signInWithPopup).mockResolvedValueOnce({ user: mockUser });
    vi.mocked(get).mockResolvedValueOnce(mockSnapshot);

    render(<Home user={null} setUser={mockSetUser} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/get started/i));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(ref({}, `users/${mockUser.uid}`));
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/listings'); // Check navigation
    });
  });

  it('should navigate to /profile if user does not exist in the database', async () => {
    const mockUser = { uid: 'newUser456' };
    const mockSnapshot = { exists: () => false };

    vi.mocked(signInWithPopup).mockResolvedValueOnce({ user: mockUser });
    vi.mocked(get).mockResolvedValueOnce(mockSnapshot);

    render(<Home user={null} setUser={mockSetUser} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/get started/i));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(ref({}, `users/${mockUser.uid}`));
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/profile'); // Check navigation
    });
  });
});
