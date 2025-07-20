import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, { loginUser, logout } from '../../store/features/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';
import { User } from '@/types/auth';

vi.mock('../../lib/axios');

interface TestStore {
    auth: {
        user: User | null;
        token: string | null;
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;
    };
}

describe('authSlice', () => {
    let store: ReturnType<typeof configureStore<{ auth: ReturnType<typeof authReducer> }>>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                auth: authReducer,
            },
        });
    });

    it('should handle initial state', () => {
        const state = store.getState();
        expect(state.auth.user).toBeNull();
        expect(state.auth.token).toBeNull();
        expect(state.auth.isAuthenticated).toBe(false);
        expect(state.auth.isLoading).toBe(false);
        expect(state.auth.error).toBeNull();
    });

    it('should handle successful login', async () => {
        const mockUser: User = {
            id: '1',
            email: 'test@example.com',
            isActive: true,
            createdAt: '2024-03-20T19:00:00Z',
            updatedAt: '2024-03-20T19:00:00Z',
        };

        const mockResponse = {
            data: {
                data: {
                    user: mockUser,
                    token: 'fake-token',
                },
                timestamp: '2024-03-20T19:00:00Z',
            },
        };

        (axiosInstance.post as any).mockResolvedValueOnce(mockResponse);

        await store.dispatch(loginUser({
            email: 'test@example.com',
            password: 'password123',
        }));

        const state = store.getState();
        expect(state.auth.user).toEqual(mockUser);
        expect(state.auth.token).toBe('fake-token');
        expect(state.auth.isAuthenticated).toBe(true);
        expect(state.auth.isLoading).toBe(false);
        expect(state.auth.error).toBeNull();
    });

    it('should handle login failure', async () => {
        const errorMessage = 'Invalid credentials';
        (axiosInstance.post as any).mockRejectedValueOnce({
            response: {
                data: {
                    message: errorMessage,
                },
            },
        });

        await store.dispatch(loginUser({
            email: 'test@example.com',
            password: 'wrongpassword',
        }));

        const state = store.getState();
        expect(state.auth.user).toBeNull();
        expect(state.auth.token).toBeNull();
        expect(state.auth.isAuthenticated).toBe(false);
        expect(state.auth.isLoading).toBe(false);
        expect(state.auth.error).toBe(errorMessage);
    });

    it('should handle logout', () => {
        // First, set a logged-in state
        store = configureStore({
            reducer: {
                auth: authReducer,
            },
            preloadedState: {
                auth: {
                    user: {
                        id: '1',
                        email: 'test@example.com',
                        isActive: true,
                        createdAt: '2024-03-20T19:00:00Z',
                        updatedAt: '2024-03-20T19:00:00Z',
                    },
                    token: 'fake-token',
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                },
            },
        });

        store.dispatch(logout());

        const state = store.getState();
        expect(state.auth.user).toBeNull();
        expect(state.auth.token).toBeNull();
        expect(state.auth.isAuthenticated).toBe(false);
        expect(state.auth.error).toBeNull();
    });
}); 