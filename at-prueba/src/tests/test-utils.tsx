import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import authReducer from '../store/features/authSlice';
import betsReducer from '../store/features/betsSlice';
import sportsReducer from '../store/features/sportsSlice';
import { AuthProvider } from '../contexts/AuthContext';

// Mock the sports slice
vi.mock('../store/features/sportsSlice', () => ({
    default: (state = {
        events: [],
        isLoading: false,
        error: null,
        lastUpdate: null,
    }, action: any) => state,
}));

function render(
    ui: React.ReactElement,
    {
        preloadedState = {},
        store = configureStore({
            reducer: {
                auth: authReducer,
                betting: betsReducer,
                sports: sportsReducer,
            },
            preloadedState,
        }),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </BrowserRouter>
            </Provider>
        );
    }
    return {
        store,
        ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render }; 