import { BaseState } from './store';

export interface SportEvent {
    id: string;
    name: string;
    homeTeam: string;
    awayTeam: string;
    eventDate: string;
    homeTeamOdds: string;
    drawOdds: string;
    awayTeamOdds: string;
    isActive: boolean;
    result: string | null;
    isLive: boolean;
    currentMinute: number | null;
    homeTeamScore: number;
    awayTeamScore: number;
    liveStatus: 'NOT_STARTED' | 'FIRST_HALF' | 'HALF_TIME' | 'SECOND_HALF';
    createdAt: string;
    updatedAt: string;
}

export type BetType = 'HOME' | 'AWAY' | 'DRAW';
export type BetStatus = 'PENDING' | 'WON' | 'LOST' | 'CASH_OUT' | 'REFUNDED';

export interface CreateBetRequest {
    sportEventId: string;
    betType: BetType;
    amount: number;
}

export interface Bet {
    id: string;
    user: {
        id: string;
        email: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
    sportEvent: SportEvent;
    betType: BetType;
    amount: string | number;
    odds: string | number;
    potentialWin: string | number;
    status: BetStatus;
    cashOutAmount: string | number | null;
    cashOutDate: string | null;
    refundReason: string | null;
    refundDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface BettingState extends BaseState {
    items: Bet[];
}

export interface SportsResponse {
    data: SportEvent[];
    timestamp: string;
}