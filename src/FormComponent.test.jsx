import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { push, ref } from 'firebase/database';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import FormComponent from './FormComponent';
import { vi } from 'vitest';

vi.mock('firebase/database', async (importOriginal) => {
    const actual = await importOriginal(); // Import the real module
    return {
      ...actual, // Spread in real functions
      getDatabase: vi.fn(), // Mock getDatabase
      ref: vi.fn(),
      push: vi.fn(),
    };
  });
  

vi.mock('firebase/storage', () => ({
getStorage: vi.fn(() => ({})), // Mock storage object
ref: vi.fn(() => ({ path: 'images/test-image.png' })), // Mock storage reference
uploadBytes: vi.fn(),
getDownloadURL: vi.fn(),
}));

describe('FormComponent post upload', () => {
  const mockUser = { uid: 'testUser123' };
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ref).mockReturnValue('mockRef');
  });

  it('should upload a post with correct format and configuration', async () => {
    const mockImage = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
  
    // Mocking Firebase storage behavior
    const mockRef = { path: 'images/test-image.png' }; // Mock reference object
    vi.mocked(ref).mockReturnValueOnce(mockRef); // Ensure ref returns this object
    vi.mocked(uploadBytes).mockResolvedValueOnce(); // Mock image upload
    vi.mocked(getDownloadURL).mockResolvedValueOnce('https://mock.url/test-image.png'); // Mock URL retrieval
    vi.mocked(push).mockResolvedValueOnce(); // Mock database push
  
    render(<FormComponent user={mockUser} />, { wrapper: MemoryRouter });
  
    // Simulate form input
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Fern' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '15.99' } });
    fireEvent.change(screen.getByLabelText(/Care Details/i), { target: { value: 'Water daily' } });
    fireEvent.change(screen.getByLabelText(/Upload Image/i), { target: { files: [mockImage] } });
  
    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
  
    await waitFor(() => {
      // Ensure uploadBytes was called with the correct arguments
      expect(uploadBytes).toHaveBeenCalledWith(
        mockRef, // The reference object
        mockImage // The uploaded image file
      );
  
      // Ensure getDownloadURL was called
      expect(getDownloadURL).toHaveBeenCalledTimes(1);
  
      // Ensure push was called with the correct arguments
      expect(push).toHaveBeenCalledWith(mockRef, {
        owner: mockUser.uid,
        phoneNumber: '123-456-7890',
        care: 'Water daily',
        duration: '2',
        favorite: false,
        imageUrl: 'https://mock.url/test-image.png',
        name: 'Fern',
        price: '15.99',
      });
  
      // Ensure no validation errors were shown
      expect(screen.queryByText(/Invalid/i)).toBeNull();
    });
  });
  
  

  
  
});
