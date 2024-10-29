import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Home from './Home';
import { signInWithPopup } from 'firebase/auth';
import { get } from 'firebase/database';
import { expect, vi } from 'vitest';

vi.mock('react-router-dom', () => {
    const originalModule = vi.importActual('react-router-dom');
    return {
        ...originalModule,
        useNavigate: vi.fn(),
        MemoryRouter: ({ children }) => <div>{children}</div>
    };
});

vi.mock('firebase/auth', () => {
    return {
        signInWithPopup: vi.fn(),
        GoogleAuthProvider: vi.fn(),
        getAuth: vi.fn()
    };
});

vi.mock('firebase/database', () => {
    return {
        ref: vi.fn(),
        get: vi.fn(),
        getDatabase: vi.fn()
    };
});

describe("Get started redirect", () => {
    const mockSetUser = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("redirects to /listings if user is signed in and exists in the database", async () => {
        const user = { uid: "123", id: "123" };
        const result = {
            user: user
        };
        const mockUserData = { exists: () => true };

        const navigate = vi.fn();
        vi.mocked(useNavigate).mockImplementation(() => navigate);

        signInWithPopup.mockResolvedValueOnce(result);
        get.mockResolvedValueOnce(mockUserData);

        render(<Home user={null} setUser={mockSetUser} />, { wrapper: MemoryRouter });

        const button = screen.getByText(/GET STARTED/i);
        fireEvent.click(button);

        await waitFor(() => {
            expect(signInWithPopup).toHaveBeenCalledTimes(1);
            expect(get).toHaveBeenCalledTimes(1);
            expect(mockSetUser).toHaveBeenCalledWith(user);
            expect(navigate).toHaveBeenCalledWith("/listings");
        });
    });
});
