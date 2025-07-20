import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import sportsReducer from './features/sportsSlice';
import bettingReducer from './features/betsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sports: sportsReducer,
        betting: bettingReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 