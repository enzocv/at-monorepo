import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../components/LoginForm';
import { loginUser } from '../../store/features/authSlice';

// Mock the auth slice
vi.mock('../../store/features/authSlice', () => ({
    default: (state = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    }, action: any) => state,
    loginUser: vi.fn(),
    clearError: vi.fn(),
}));

describe('LoginForm', () => {
    it('renders login form correctly', () => {
        render(<LoginForm />);
        
        expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
        const mockLoginUser = loginUser as unknown as ReturnType<typeof vi.fn>;
        mockLoginUser.mockResolvedValueOnce({
            data: {
                user: {
                    id: '1',
                    email: 'test@example.com',
                },
                token: 'fake-token',
            },
        });

        render(<LoginForm />);
        
        const emailInput = screen.getByPlaceholderText(/correo@ejemplo.com/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
        
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLoginUser).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });
}); 