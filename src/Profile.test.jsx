import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { ref, set, get } from 'firebase/database';
import { Autocomplete } from '@react-google-maps/api';
import ProfileComponent from './Profile';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('firebase/database', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ref: vi.fn(),
    set: vi.fn(),
    get: vi.fn(),
  };
});

vi.mock('@react-google-maps/api', () => ({
  Autocomplete: ({ children, onLoad, onPlaceChanged }) => {
    return (
      <div
        data-testid="autocomplete"
        onLoad={() => onLoad({ getPlace: vi.fn(() => ({ formatted_address: '123 Test St' })) })}
        onChange={onPlaceChanged}
      >
        {children}
      </div>
    );
  },
}));

describe('ProfileComponent', () => {
  const mockUser = { uid: 'testUser123', email: 'testuser@example.com', displayName: 'John Doe' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ref).mockReturnValue('mockRef');
  });

  it('should render the form and submit user profile data', async () => {
    // Mock `get` to simulate a new user without profile data
    vi.mocked(get).mockResolvedValueOnce({
      exists: () => false,
    });
    vi.mocked(set).mockResolvedValueOnce();

    render(<ProfileComponent user={mockUser} />);

    // Ensure inputs are rendered
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Profile Picture/i)).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Test St' } });
    const mockImage = new File(['(⌐□_□)'], 'profile-pic.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Profile Picture/i), { target: { files: [mockImage] } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Complete/i }));

    await waitFor(() => {
      // Check if `set` was called with correct data
      expect(set).toHaveBeenCalledWith('mockRef', {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Test St',
        pic: mockImage,
        email: mockUser.email,
      });

      // Ensure no validation errors are shown
      expect(screen.queryByText(/Please fill in all fields/i)).toBeNull();
    });
  });
});
