import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import BettingForm from '../../components/BettingForm';
import { placeBet } from '../../store/features/betsSlice';
import { SportEvent } from '@/types/betting';

// Mock the bets slice
vi.mock('../../store/features/betsSlice', () => ({
    default: (state = {
        items: [],
        loading: false,
        error: null,
    }, action: any) => state,
    placeBet: vi.fn(),
}));

const mockEvent: SportEvent = {
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
    liveStatus: 'FIRST_HALF',
    createdAt: '2024-03-20T19:00:00Z',
    updatedAt: '2024-03-20T19:00:00Z',
};

describe('BettingForm', () => {
    const mockOnBetPlaced = vi.fn();

    it('renders betting form with event details', () => {
        render(<BettingForm selectedEvent={mockEvent} onBetPlaced={mockOnBetPlaced} />);
        
        expect(screen.getByText(mockEvent.name)).toBeInTheDocument();
        expect(screen.getByText(mockEvent.homeTeam)).toBeInTheDocument();
        expect(screen.getByText(mockEvent.awayTeam)).toBeInTheDocument();
        expect(screen.getByText('Empate')).toBeInTheDocument();
    });

    it('calculates potential win correctly', async () => {
        render(<BettingForm selectedEvent={mockEvent} onBetPlaced={mockOnBetPlaced} />);
        
        // Select home team (odds 2.10)
        const homeTeamButton = screen.getByText(mockEvent.homeTeam);
        fireEvent.click(homeTeamButton);

        // Enter amount
        const amountInput = screen.getByPlaceholderText(/0\.00/i);
        await userEvent.type(amountInput, '100');

        // Expected potential win: 100 * 2.10 = 210
        await waitFor(() => {
            expect(screen.getByText('$210.00')).toBeInTheDocument();
        });
    });
}); 