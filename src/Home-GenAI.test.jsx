import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Home from './Home'; // Path to your component
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { database, ref, get, getDatabase } from 'firebase/database';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Mock Firebase auth and database functions
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({})), // Mock GoogleAuthProvider
}));

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn().mockReturnValue({}), // Mock getDatabase to return a mock database instance
  ref: vi.fn(),
  get: vi.fn().mockResolvedValue({ exists: () => false }), // Mock get to resolve with an empty user
  onValue: vi.fn(),
}));

// Mock useNavigate and BrowserRouter from react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>, // Mock BrowserRouter
  useNavigate: vi.fn(),
}));

describe('Home Component', () => {
  let navigate;

  beforeEach(() => {
    // Reset mocks before each test
    navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
  });

  test('navigates to /profile if user does not exist in the database', async () => {
    const setUser = vi.fn();
    const user = null; // No user at the start

    // Mock Firebase result
    const mockUser = { uid: '12345' };
    vi.mocked(signInWithPopup).mockResolvedValue({ user: mockUser });
    vi.mocked(get).mockResolvedValue({ exists: () => false });

    render(
      <Router>
        <Home user={user} setUser={setUser} />
      </Router>
    );

    // Simulate clicking the "Get Started" button
    fireEvent.click(screen.getByText('GET STARTED'));

    // Wait for navigation and check if navigate was called with '/profile'
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/profile'));
  });

  test('navigates to /listings if user already exists in the database', async () => {
    const setUser = vi.fn();
    const user = null;

    // Mock Firebase result
    const mockUser = { uid: '12345' };
    vi.mocked(signInWithPopup).mockResolvedValue({ user: mockUser });
    vi.mocked(get).mockResolvedValue({ exists: () => true });

    render(
      <Router>
        <Home user={user} setUser={setUser} />
      </Router>
    );

    // Simulate clicking the "Get Started" button
    fireEvent.click(screen.getByText('GET STARTED'));

    // Wait for navigation and check if navigate was called with '/listings'
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/listings'));
  });

  test('handles sign-in errors gracefully', async () => {
    const setUser = vi.fn();
    const user = null;

    // Mock sign-in to reject with an error
    const signInError = new Error('Sign-in failed');
    vi.mocked(signInWithPopup).mockRejectedValue(signInError);

    // Spy on console.error to track if it's called
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Router>
        <Home user={user} setUser={setUser} />
      </Router>
    );

    // Simulate clicking the "Get Started" button
    fireEvent.click(screen.getByText('GET STARTED'));

    // Wait for no navigation and expect the error to be logged
    await waitFor(() => {
      // Check if console.error was called with the correct error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating account', signInError);
    });

    // Clean up spy after test
    consoleErrorSpy.mockRestore();
  });
});
