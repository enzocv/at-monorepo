import { describe, it, expect, vi, beforeEach } from 'vitest';
import betsReducer, { placeBet, fetchUserBets, cashOutBet, updateBetStatus } from '../../store/features/betsSlice';
import { configureStore } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';
import { BetStatus, Bet } from '@/types/betting';
import type { RootState } from '@/store';

vi.mock('../../lib/axios');

const mockBet = {
    id: '1',
    user: {
        id: '1',
        email: 'test@example.com',
        isActive: true,
        createdAt: '2024-03-20T19:00:00Z',
        updatedAt: '2024-03-20T19:00:00Z',
    },
    sportEvent: {
        id: '1',
        name: 'Real Madrid vs Barcelona',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        eventDate: '2024-03-20T20:00:00Z',
        homeTeamOdds: '2.10',
        drawOdds: '3.50',
        awayTeamOdds: '3.20',
        isActive: true,
        result: null,
        isLive: true,
        currentMinute: 35,
        homeTeamScore: 1,
        awayTeamScore: 0,
        liveStatus: 'FIRST_HALF' as const,
        createdAt: '2024-03-20T19:00:00Z',
        updatedAt: '2024-03-20T19:00:00Z',
    },
    betType: 'HOME' as const,
    amount: '100',
    odds: '2.10',
    potentialWin: '210',
    status: 'PENDING' as BetStatus,
    cashOutAmount: null,
    cashOutDate: null,
    refundReason: null,
    refundDate: null,
    createdAt: '2024-03-20T19:00:00Z',
    updatedAt: '2024-03-20T19:00:00Z',
};

interface TestStore {
    betting: {
        items: Bet[];
        loading: boolean;
        error: string | null;
    };
}

describe('betsSlice', () => {
    let store: ReturnType<typeof configureStore<{ betting: ReturnType<typeof betsReducer> }>>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                betting: betsReducer,
            },
        });
    });

    it('should handle initial state', () => {
        const state = store.getState();
        expect(state.betting.items).toEqual([]);
        expect(state.betting.loading).toBe(false);
        expect(state.betting.error).toBeNull();
    });

    it('should handle placing a bet', async () => {
        const mockResponse = {
            data: {
                data: mockBet,
                timestamp: '2024-03-20T19:00:00Z',
            },
        };

        (axiosInstance.post as any).mockResolvedValueOnce(mockResponse);

        await store.dispatch(placeBet({
            sportEventId: mockBet.sportEvent.id,
            betType: mockBet.betType,
            amount: Number(mockBet.amount),
        }));

        const state = store.getState();
        expect(state.betting.items[0]).toEqual(mockBet);
        expect(state.betting.loading).toBe(false);
        expect(state.betting.error).toBeNull();
    });

    it('should handle fetching user bets', async () => {
        const mockResponse = {
            data: {
                data: [mockBet],
                timestamp: '2024-03-20T19:00:00Z',
            },
        };

        (axiosInstance.get as any).mockResolvedValueOnce(mockResponse);

        await store.dispatch(fetchUserBets());

        const state = store.getState();
        expect(state.betting.items).toEqual([mockBet]);
        expect(state.betting.loading).toBe(false);
        expect(state.betting.error).toBeNull();
    });

    it('should handle cash out', async () => {
        const mockCashOutResponse = {
            data: {
                data: {
                    ...mockBet,
                    status: 'CASH_OUT' as const,
                    cashOutAmount: '150',
                    cashOutDate: '2024-03-20T19:30:00Z',
                },
                timestamp: '2024-03-20T19:30:00Z',
            },
        };

        (axiosInstance.post as any).mockResolvedValueOnce(mockCashOutResponse);

        await store.dispatch(cashOutBet(mockBet.id));

        const state = store.getState();
        expect(state.betting.loading).toBe(false);
        expect(state.betting.error).toBeNull();
    });

    it('should handle updating bet status', async () => {
        const newStatus: BetStatus = 'WON';
        const mockUpdateResponse = {
            data: {
                data: {
                    ...mockBet,
                    status: newStatus,
                },
                timestamp: '2024-03-20T19:30:00Z',
            },
        };

        (axiosInstance.put as any).mockResolvedValueOnce(mockUpdateResponse);

        await store.dispatch(updateBetStatus({
            betId: mockBet.id,
            status: newStatus,
        }));

        const state = store.getState();
        expect(state.betting.loading).toBe(false);
        expect(state.betting.error).toBeNull();
    });

    it('should handle errors', async () => {
        const errorMessage = 'Error processing bet';
        (axiosInstance.post as any).mockRejectedValueOnce({
            response: {
                data: {
                    message: errorMessage,
                },
            },
        });

        await store.dispatch(placeBet({
            sportEventId: mockBet.sportEvent.id,
            betType: mockBet.betType,
            amount: Number(mockBet.amount),
        }));

        const state = store.getState();
        expect(state.betting.loading).toBe(false);
        expect(state.betting.error).toBe(errorMessage);
    });
}); 