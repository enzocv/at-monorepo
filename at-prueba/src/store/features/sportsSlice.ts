import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SportEvent, SportsResponse } from '@/types/betting';
import axiosInstance from '@/lib/axios';

interface SportsState {
    events: SportEvent[];
    isLoading: boolean;
    error: string | null;
    lastUpdate: string | null;
}

const initialState: SportsState = {
    events: [],
    isLoading: false,
    error: null,
    lastUpdate: null,
};

export const fetchSportEvents = createAsyncThunk<SportsResponse>(
    'sports/fetchEvents',
    async (_, { rejectWithValue }) => {
        try {
            // La ruta ahora es relativa al baseURL de axios (/api)
            const response = await axiosInstance.get<SportsResponse>('/sports');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar los eventos deportivos');
        }
    }
);

const sportsSlice = createSlice({
    name: 'sports',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSportEvents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSportEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload.data;
                state.lastUpdate = action.payload.timestamp;
                state.error = null;
            })
            .addCase(fetchSportEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = sportsSlice.actions;
export default sportsSlice.reducer; 