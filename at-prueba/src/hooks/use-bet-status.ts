import { BetStatus, BetType } from '@/types/betting';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, Clock } from 'lucide-react';

export const useBetStatus = () => {
    const getStatusColor = (status: BetStatus) => {
        switch (status) {
            case 'WON': return 'default';
            case 'LOST': return 'destructive';
            case 'CASH_OUT': return 'default';
            case 'REFUNDED': return 'secondary';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status: BetStatus) => {
        switch (status) {
            case 'WON': return TrendingUp;
            case 'LOST': return TrendingDown;
            case 'CASH_OUT': return DollarSign;
            case 'REFUNDED': return RefreshCw;
            default: return Clock;
        }
    };

    const getStatusText = (status: BetStatus) => {
        switch (status) {
            case 'WON': return 'Ganada';
            case 'LOST': return 'Perdida';
            case 'CASH_OUT': return 'Cash Out';
            case 'REFUNDED': return 'Reembolsada';
            default: return 'Pendiente';
        }
    };

    const getBetTypeText = (betType: BetType) => {
        switch (betType) {
            case 'HOME': return 'Local';
            case 'AWAY': return 'Visitante';
            case 'DRAW': return 'Empate';
        }
    };

    return {
        getStatusColor,
        getStatusIcon,
        getStatusText,
        getBetTypeText,
    };
}; 