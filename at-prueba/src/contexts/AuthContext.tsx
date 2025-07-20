import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { User } from '@/types/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const updateBalance = (newBalance: number) => {
        // TODO: Implementar cuando el backend soporte balance
        console.log('Update balance:', newBalance);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                updateBalance,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};