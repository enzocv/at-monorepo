import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Bet, CreateBetRequest, BettingState, BetStatus } from '@/types/betting';
import { ApiResponse } from '@/types/store';
import axiosInstance from '@/lib/axios';

const initialState: BettingState = {
    items: [],
    loading: false,
    error: null
};

export const placeBet = createAsyncThunk<Bet, CreateBetRequest>(
    'betting/place',
    async (betData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<ApiResponse<Bet>>('/bets', betData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al realizar la apuesta');
        }
    }
);

export const fetchUserBets = createAsyncThunk<Bet[]>(
    'betting/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<ApiResponse<Bet[]>>('/bets');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar las apuestas');
        }
    }
);

interface CashOutRequest {
    betId: string;
}

export const cashOutBet = createAsyncThunk<Bet, CashOutRequest['betId']>(
    'betting/cashOut',
    async (betId, { rejectWithValue }) => {
        try {
            const request: CashOutRequest = { betId };
            const response = await axiosInstance.post<ApiResponse<Bet>>('/bets/cash-out', request);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al realizar el cash out');
        }
    }
);

interface UpdateBetStatusRequest {
    betId: string;
    status: BetStatus;
    refundReason?: string;
}

export const updateBetStatus = createAsyncThunk<Bet, UpdateBetStatusRequest>(
    'betting/updateStatus',
    async (updateData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put<ApiResponse<Bet>>('/bets/status', updateData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar el estado de la apuesta');
        }
    }
);

const bettingSlice = createSlice({
    name: 'betting',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Place Bet
            .addCase(placeBet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(placeBet.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.error = null;
            })
            .addCase(placeBet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch User Bets
            .addCase(fetchUserBets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserBets.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.error = null;
            })
            .addCase(fetchUserBets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Cash Out Bet
            .addCase(cashOutBet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cashOutBet.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(bet => bet.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(cashOutBet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Bet Status
            .addCase(updateBetStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBetStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(bet => bet.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateBetStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError } = bettingSlice.actions;
export default bettingSlice.reducer; 