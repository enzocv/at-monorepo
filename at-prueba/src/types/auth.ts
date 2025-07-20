export interface User {
    id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: {
        user: User;
        token: string;
    };
    timestamp: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}