import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { push, ref } from 'firebase/database';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import FormComponent from './FormComponent';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('firebase/database', async (importOriginal) => {
    const actual = await importOriginal(); 
    return {
      ...actual,
      getDatabase: vi.fn(),
      ref: vi.fn(),
      push: vi.fn(),
    };
  });
  

vi.mock('firebase/storage', () => ({
getStorage: vi.fn(() => ({})), 
ref: vi.fn(() => ({ path: 'images/test-image.png' })), 
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
  
    
    const mockRef = { path: 'images/test-image.png' }; 
    vi.mocked(ref).mockReturnValueOnce(mockRef); 
    vi.mocked(uploadBytes).mockResolvedValueOnce(); 
    vi.mocked(getDownloadURL).mockResolvedValueOnce('https://mock.url/test-image.png');
    vi.mocked(push).mockResolvedValueOnce(); 
  
    render(<FormComponent user={mockUser} />, { wrapper: MemoryRouter });
  
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Fern' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '15.99' } });
    fireEvent.change(screen.getByLabelText(/Care Details/i), { target: { value: 'Water daily' } });
    fireEvent.change(screen.getByLabelText(/Upload Image/i), { target: { files: [mockImage] } });
  
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
  
    await waitFor(() => {
      
      expect(uploadBytes).toHaveBeenCalledWith(
        mockRef, 
        mockImage 
      );
  
      expect(getDownloadURL).toHaveBeenCalledTimes(1);
  
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
  
      expect(screen.queryByText(/Invalid/i)).toBeNull();
    });
  });

  it('should prevent submission with an invalid phone number format', async () => {
    const mockImage = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
  
    render(<FormComponent user={mockUser} />, { wrapper: MemoryRouter });
  
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Fern' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: 'invalid-phone' } }); // Invalid phone number
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '15.99' } });
    fireEvent.change(screen.getByLabelText(/Care Details/i), { target: { value: 'Water daily' } });
    fireEvent.change(screen.getByLabelText(/Upload Image/i), { target: { files: [mockImage] } });
  
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
  
    await waitFor(() => {
      expect(screen.getByText(/Invalid phone number format/i)).toBeInTheDocument();
  
      expect(uploadBytes).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });
  });
  
  
  
  

  
  
});
