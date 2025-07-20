import { Bet, BetStatus } from '@/types/betting';
import { parseNumber } from '@/lib/utils';

export const useBetCalculations = () => {
    const calculateTotalWagered = (bets: Bet[]): number => {
        return bets
            .filter(bet => bet.status === 'LOST')
            .reduce((sum, bet) => sum + parseNumber(bet.amount), 0);
    };

    const calculateTotalWon = (bets: Bet[]): number => {
        return bets
            .filter(bet => bet.status === 'WON')
            .reduce((sum, bet) => sum + parseNumber(bet.potentialWin), 0);
    };

    const filterBetsByStatus = (bets: Bet[], statusFilter: BetStatus | 'ALL'): Bet[] => {
        return bets.filter(bet => 
            statusFilter === 'ALL' ? true : bet.status === statusFilter
        );
    };

    return {
        calculateTotalWagered,
        calculateTotalWon,
        filterBetsByStatus,
    };
}; 